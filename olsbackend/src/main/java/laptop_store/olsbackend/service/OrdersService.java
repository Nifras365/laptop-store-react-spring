package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.OrderDTO;

public interface OrdersService {
    Long createOrder(OrderDTO orderDTO);
}
