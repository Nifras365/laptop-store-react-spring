package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.OrderDTO;
import laptop_store.olsbackend.entity.OrdersEntity;
import laptop_store.olsbackend.mapper.OrdersMapper;
import laptop_store.olsbackend.repository.OrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrdersServiceImpl implements OrdersService{
    @Autowired
    private OrdersRepository ordersRepository;
    @Autowired
    private OrdersMapper ordersMapper;
    @Override
    public Long createOrder(OrderDTO orderDTO){
        return ordersRepository.save(OrdersEntity.builder()
                .UserID(orderDTO.getUserID())
                .orderItems(orderDTO.getOrderItems())
                .FinalPrice(orderDTO.getFinalPrice()).build()).getOrderId();
    }
}