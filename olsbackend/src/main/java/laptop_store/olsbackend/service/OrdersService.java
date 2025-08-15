package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.OrderDTO;

import java.util.List;

public interface OrdersService {
    Long createOrder(OrderDTO orderDTO);
    List<OrderDTO> getAllOrders();
    List<OrderDTO> getOrderByUserID(Long userID);
}
