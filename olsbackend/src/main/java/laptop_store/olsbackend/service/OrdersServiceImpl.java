package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.OrderDTO;
import laptop_store.olsbackend.entity.OrderItemEntity;
import laptop_store.olsbackend.entity.OrdersEntity;
import laptop_store.olsbackend.mapper.OrdersMapper;
import laptop_store.olsbackend.repository.OrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrdersServiceImpl implements OrdersService{
    @Autowired
    private OrdersRepository ordersRepository;
    @Autowired
    private OrdersMapper ordersMapper;
    @Override
    public Long createOrder(OrderDTO orderDTO) {
        if (orderDTO.getOrderItemDTOS() == null || orderDTO.getOrderItemDTOS().isEmpty()) {
            throw new IllegalArgumentException("Order items cannot be null or empty");
        }

        OrdersEntity ordersEntity = OrdersEntity.builder()
                .userID(orderDTO.getUserID())
                .finalPrice(orderDTO.getFinalPrice())
                .build();

        List<OrderItemEntity> orderItemEntities = ordersMapper.mapOrderItemToEntity(orderDTO.getOrderItemDTOS());

        if (orderItemEntities != null) {
            orderItemEntities.forEach(orderItem -> orderItem.setOrder(ordersEntity));
        }

        ordersEntity.setOrderItemEntities(orderItemEntities);

        return ordersRepository.save(ordersEntity).getOrderId();
    }

    @Override
    public List<OrderDTO> getAllOrders(){
        return ordersRepository.findAll().stream()
                .map(ordersMapper::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getOrderByUserID(Long userID){
        return ordersRepository.findByUserID(userID).stream()
                .map(ordersMapper::mapToDto)
                .collect(Collectors.toList());
    }
}