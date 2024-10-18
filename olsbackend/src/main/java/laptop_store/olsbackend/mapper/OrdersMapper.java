package laptop_store.olsbackend.mapper;

import laptop_store.olsbackend.dto.OrderDTO;
import laptop_store.olsbackend.entity.OrdersEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrdersMapper {
    OrderDTO mapToDto(OrdersEntity ordersEntity);
    OrdersEntity mapToEntity(OrderDTO orderDTO);
}
