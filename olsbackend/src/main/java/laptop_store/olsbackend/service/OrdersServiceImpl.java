package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.OrderDTO;
import laptop_store.olsbackend.dto.OrderItemDTO;
import laptop_store.olsbackend.entity.OrderItemEntity;
import laptop_store.olsbackend.entity.OrdersEntity;
import laptop_store.olsbackend.mapper.OrdersMapper;
import laptop_store.olsbackend.repository.LaptopRepository;
import laptop_store.olsbackend.repository.OrdersRepository;
import laptop_store.olsbackend.exceptions.ItemNotFoundException;
import laptop_store.olsbackend.entity.LaptopEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class OrdersServiceImpl implements OrdersService{
    @Autowired
    private OrdersRepository ordersRepository;
    @Autowired
    private OrdersMapper ordersMapper;
    @Autowired
    private LaptopRepository laptopRepository;

    @Override
    public Long createOrder(OrderDTO orderDTO) {
        if (orderDTO.getOrderItemDTOS() == null || orderDTO.getOrderItemDTOS().isEmpty()) {
            throw new IllegalArgumentException("Order items cannot be null or empty");
        }

        OrdersEntity ordersEntity = OrdersEntity.builder()
                .userID(orderDTO.getUserID())
                .finalPrice(orderDTO.getFinalPrice())
                .status("PLACED")
                .build();

        List<OrderItemEntity> orderItemEntities = ordersMapper.mapOrderItemToEntity(orderDTO.getOrderItemDTOS());

        populateMissingEntityTitles(orderItemEntities);

        orderItemEntities.forEach(orderItem -> orderItem.setOrder(ordersEntity));

        ordersEntity.setOrderItemEntities(orderItemEntities);

        log.info("Creating order for user ID: {}, with final price: {}, itemCount: {}",
                 ordersEntity.getUserID(), ordersEntity.getFinalPrice(), orderItemEntities.size());

        return ordersRepository.save(ordersEntity).getOrderId();
    }

    @Override
    public List<OrderDTO> getAllOrders(){
        Map<Long, String> modelCache = new HashMap<>();
        return ordersRepository.findAll().stream()
                .map(ordersMapper::mapToDto)
                .map(orderDTO -> populateMissingDtoTitles(orderDTO, modelCache))
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrderByUserID(Long userID){
        Map<Long, String> modelCache = new HashMap<>();
        return ordersRepository.findByUserID(userID).stream()
                .map(ordersMapper::mapToDto)
                .map(orderDTO -> populateMissingDtoTitles(orderDTO, modelCache))
                .collect(Collectors.toList());
    }

    private void populateMissingEntityTitles(List<OrderItemEntity> orderItemEntities) {
        if (orderItemEntities == null) {
            return;
        }

        for (OrderItemEntity orderItem : orderItemEntities) {
            if (orderItem.getLaptopID() == null) {
                throw new IllegalArgumentException("Laptop ID cannot be null");
            }

            String model = laptopRepository.findById(orderItem.getLaptopID())
                    .orElseThrow(() -> new IllegalArgumentException("Laptop with ID " + orderItem.getLaptopID() + " does not exist"))
                    .getModel();

            // Snapshot the laptop model into the order item so future reads do not rely on laptop table state.
            orderItem.setTitle(model);
        }
    }

    private OrderDTO populateMissingDtoTitles(OrderDTO orderDTO, Map<Long, String> modelCache) {
        if (orderDTO == null || orderDTO.getOrderItemDTOS() == null) {
            return orderDTO;
        }

        for (OrderItemDTO item : orderDTO.getOrderItemDTOS()) {
            if (item == null || item.getLaptopID() == null) {
                continue;
            }

            if (item.getTitle() == null || item.getTitle().isBlank()) {
                String model = modelCache.computeIfAbsent(item.getLaptopID(), id ->
                        laptopRepository.findById(id)
                                .map(laptop -> laptop.getModel())
                                .orElse(null)
                );
                item.setTitle(model);
            }
        }

        return orderDTO;
    }

    @Override
    public void cancelOrder(Long orderId) {
        OrdersEntity order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new ItemNotFoundException("Order not found with ID: " + orderId));

        if (!"PLACED".equals(order.getStatus()) && !"PROCESSING".equals(order.getStatus())) {
            throw new IllegalStateException("Order cannot be cancelled in its current status: " + order.getStatus());
        }

        order.setStatus("CANCELLED");

        // Restore stock
        for (OrderItemEntity item : order.getOrderItemEntities()) {
            LaptopEntity laptop = laptopRepository.findById(item.getLaptopID())
                    .orElseThrow(() -> new ItemNotFoundException("Laptop not found with ID: " + item.getLaptopID()));
            laptop.setStockQuantity(Math.toIntExact(laptop.getStockQuantity() + item.getQuantity()));
            laptopRepository.save(laptop);
        }

        ordersRepository.save(order);
        log.info("Order ID {} cancelled successfully", orderId);
    }

    @Override
    public void updateOrderStatus(Long orderId, String status) {
        OrdersEntity order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new ItemNotFoundException("Order not found with ID: " + orderId));
        order.setStatus(status);
        ordersRepository.save(order);
        log.info("Order ID {} status updated to {}", orderId, status);
    }

    @Override
    public void deleteOrder(Long orderId) {
        OrdersEntity order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new ItemNotFoundException("Order not found with ID: " + orderId));

        if (!"CANCELLED".equals(order.getStatus()) && !"DELIVERED".equals(order.getStatus())) {
            throw new IllegalStateException("Order cannot be deleted unless it is CANCELLED or DELIVERED. Current status: " + order.getStatus());
        }

        ordersRepository.delete(order);
        log.info("Order ID {} deleted successfully", orderId);
    }
}