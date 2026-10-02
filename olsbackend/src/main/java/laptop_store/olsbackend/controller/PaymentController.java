package laptop_store.olsbackend.controller;

import jakarta.validation.Valid;
import laptop_store.olsbackend.dto.PaymentConfirmDTO;
import laptop_store.olsbackend.dto.PaymentIntentDTO;
import laptop_store.olsbackend.dto.PaymentResponseDTO;
import laptop_store.olsbackend.dto.ResponseDTO;
import laptop_store.olsbackend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-intent")
    public ResponseEntity<ResponseDTO<PaymentResponseDTO>> createPaymentIntent(
            @Valid @RequestBody PaymentIntentDTO paymentIntentDTO) {
        log.info("Received create-intent request for user ID: {}, amount: {}",
                paymentIntentDTO.getUserId(), paymentIntentDTO.getAmount());

        try {
            PaymentResponseDTO response = paymentService.createPaymentIntent(paymentIntentDTO);
            log.info("PaymentIntent created successfully. OrderId: {}, PaymentIntentId: {}",
                    response.getOrderId(), response.getPaymentIntentId());

            return ResponseEntity.ok(new ResponseDTO<>(
                    HttpStatus.OK.value(),
                    "Payment intent created successfully",
                    response));
        } catch (Exception e) {
            log.error("Failed to create payment intent: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO<>(
                            HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Failed to create payment: " + e.getMessage(),
                            null));
        }
    }


    // verify stripe payment
    @PostMapping("/confirm")
    public ResponseEntity<ResponseDTO<String>> confirmPayment(
            @Valid @RequestBody PaymentConfirmDTO paymentConfirmDTO) {
        log.info("Received confirm request for order ID: {}, PaymentIntent: {}",
                paymentConfirmDTO.getOrderId(), paymentConfirmDTO.getPaymentIntentId());

        try {
            paymentService.confirmPayment(paymentConfirmDTO);
            log.info("Payment confirmed successfully for order ID: {}", paymentConfirmDTO.getOrderId());

            return ResponseEntity.ok(new ResponseDTO<>(
                    HttpStatus.OK.value(),
                    "Payment confirmed and order placed successfully",
                    "Success"));
        } catch (IllegalStateException e) {
            log.error("Payment verification failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ResponseDTO<>(
                            HttpStatus.BAD_REQUEST.value(),
                            e.getMessage(),
                            null));
        } catch (Exception e) {
            log.error("Unexpected error confirming payment: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO<>(
                            HttpStatus.INTERNAL_SERVER_ERROR.value(),
                            "Failed to confirm payment: " + e.getMessage(),
                            null));
        }
    }
}
