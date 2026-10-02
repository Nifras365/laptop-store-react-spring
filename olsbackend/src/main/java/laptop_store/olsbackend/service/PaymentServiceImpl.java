package laptop_store.olsbackend.service;

import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import laptop_store.olsbackend.dto.PaymentConfirmDTO;
import laptop_store.olsbackend.dto.PaymentIntentDTO;
import laptop_store.olsbackend.dto.PaymentResponseDTO;
import laptop_store.olsbackend.entity.OrderItemEntity;
import laptop_store.olsbackend.entity.OrdersEntity;
import laptop_store.olsbackend.exceptions.ItemNotFoundException;
import laptop_store.olsbackend.mapper.OrdersMapper;
import laptop_store.olsbackend.repository.CartRepository;
import laptop_store.olsbackend.repository.LaptopRepository;
import laptop_store.olsbackend.repository.OrdersRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final OrdersRepository ordersRepository;
    private final OrdersMapper ordersMapper;
    private final LaptopRepository laptopRepository;
    private final CartRepository cartRepository;

    @Override
    public PaymentResponseDTO createPaymentIntent(PaymentIntentDTO dto) {
        log.info("Creating Stripe PaymentIntent for user ID: {}, amount: {} LKR", dto.getUserId(), dto.getAmount());

        try {
            // Pre-check: Ensure the user's cart is not empty before creating an order
            // fix for doubling error (back button issue)
            List<laptop_store.olsbackend.entity.CartEntity> cartItems = cartRepository.findByUserID(dto.getUserId());
            if (cartItems == null || cartItems.isEmpty()) {
                log.warn("User {} attempted to create an order but their cart is empty. Aborting.", dto.getUserId());
                throw new IllegalStateException("Cannot create order: Cart is empty");
            }

            // Check for existing PENDING_PAYMENT order to prevent duplicates
            java.util.Optional<OrdersEntity> existingPending = ordersRepository
                    .findFirstByUserIDAndStatusAndFinalPrice(dto.getUserId(), "PENDING_PAYMENT", dto.getAmount());
            
            if (existingPending.isPresent()) {
                OrdersEntity existing = existingPending.get();
                log.info("Found existing PENDING_PAYMENT order ID: {}. Reusing Stripe Intent: {}", 
                        existing.getOrderId(), existing.getStripePaymentIntentId());
                
                // Re-retrieve the PaymentIntent to get a fresh clientSecret
                PaymentIntent pi = PaymentIntent.retrieve(existing.getStripePaymentIntentId());
                return PaymentResponseDTO.builder()
                        .clientSecret(pi.getClientSecret())
                        .paymentIntentId(pi.getId())
                        .orderId(existing.getOrderId())
                        .build();
            }

            // 1. Create the Stripe PaymentIntent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(dto.getAmount() * 100) // Stripe expects amounts in the smallest currency unit (cents)
                    .setCurrency("lkr")
                    .setDescription("Laptop Store Order - User #" + dto.getUserId())
                    .putMetadata("userId", dto.getUserId().toString())
                    .addPaymentMethodType("card")
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);
            log.info("Stripe PaymentIntent created: {}", paymentIntent.getId());

            // 2. Create the order in PENDING_PAYMENT status
            OrdersEntity order = OrdersEntity.builder()
                    .userID(dto.getUserId())
                    .finalPrice(dto.getAmount())
                    .status("PENDING_PAYMENT")
                    .stripePaymentIntentId(paymentIntent.getId())
                    .paymentMethod("STRIPE")
                    .build();

            // Map and attach order items
            List<OrderItemEntity> orderItems = ordersMapper.mapOrderItemToEntity(dto.getOrderItems());
            populateOrderItemTitles(orderItems);
            orderItems.forEach(item -> item.setOrder(order));
            order.setOrderItemEntities(orderItems);

            OrdersEntity savedOrder = ordersRepository.save(order);
            log.info("Order created with ID: {} in PENDING_PAYMENT status", savedOrder.getOrderId());

            // 3. Return the client secret for frontend confirmation
            return PaymentResponseDTO.builder()
                    .clientSecret(paymentIntent.getClientSecret())
                    .paymentIntentId(paymentIntent.getId())
                    .orderId(savedOrder.getOrderId())
                    .build();

        } catch (StripeException e) {
            log.error("Stripe API error while creating PaymentIntent: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create payment: " + e.getMessage());
        }
    }

    @Override
    public void confirmPayment(PaymentConfirmDTO dto) {
        log.info("Confirming payment for order ID: {}, PaymentIntent: {}", dto.getOrderId(), dto.getPaymentIntentId());

        // 1. Find the order
        OrdersEntity order = ordersRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new ItemNotFoundException("Order not found with ID: " + dto.getOrderId()));

        // Verify the PaymentIntent ID matches
        if (!dto.getPaymentIntentId().equals(order.getStripePaymentIntentId())) {
            log.error("PaymentIntent ID mismatch. Expected: {}, Got: {}", order.getStripePaymentIntentId(), dto.getPaymentIntentId());
            throw new IllegalStateException("Payment verification failed: PaymentIntent ID mismatch");
        }

        try {
            // 2. Verify with Stripe that payment actually succeeded
            PaymentIntent paymentIntent = PaymentIntent.retrieve(dto.getPaymentIntentId());

            if (!"succeeded".equals(paymentIntent.getStatus())) {
                log.error("Payment not succeeded. Stripe status: {}", paymentIntent.getStatus());
                throw new IllegalStateException("Payment has not been confirmed by Stripe. Status: " + paymentIntent.getStatus());
            }

            // 3. Update order status to PLACED
            order.setStatus("PLACED");
            ordersRepository.save(order);
            log.info("Order ID: {} confirmed and set to PLACED", dto.getOrderId());

            // 4. Clear user's cart
            cartRepository.deleteByUserID(order.getUserID());
            log.info("Cart cleared for user ID: {}", order.getUserID());

        } catch (StripeException e) {
            log.error("Stripe API error while verifying payment: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to verify payment with Stripe: " + e.getMessage());
        }
    }

    private void populateOrderItemTitles(List<OrderItemEntity> orderItems) {
        log.info("Populating laptop titles for {} order items", orderItems.size());
        for (OrderItemEntity item : orderItems) {
            if (item.getLaptopID() == null) {
                log.error("Found order item with null laptop ID");
                throw new IllegalArgumentException("Laptop ID cannot be null");
            }
            String model = laptopRepository.findById(item.getLaptopID())
                    .orElseThrow(() -> {
                        log.error("Laptop with ID {} does not exist", item.getLaptopID());
                        return new IllegalArgumentException("Laptop with ID " + item.getLaptopID() + " does not exist");
                    })
                    .getModel();
            item.setTitle(model);
            log.info("Populated title '{}' for laptop ID {}", model, item.getLaptopID());
        }
    }
}
