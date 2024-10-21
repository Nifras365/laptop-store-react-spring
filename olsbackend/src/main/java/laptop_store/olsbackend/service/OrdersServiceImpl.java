package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.OrderDTO;
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
    public Long createOrder(OrderDTO orderDTO){
        OrdersEntity ordersEntity = ordersMapper.mapToEntity(orderDTO);

        return ordersRepository.save(ordersEntity).getOrderId();
    }
    @Override
    public List<OrderDTO> getAllOrders(){
        return ordersRepository.findAll().stream()
                .map(ordersMapper::mapToDto)
                .collect(Collectors.toList());
    }
}