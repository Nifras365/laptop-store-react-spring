package laptop_store.olsbackend.mapper;

import laptop_store.olsbackend.dto.OrderDTO;
import laptop_store.olsbackend.dto.OrderItemDTO;
import laptop_store.olsbackend.entity.OrderItemEntity;
import laptop_store.olsbackend.entity.OrdersEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.TargetType;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrdersMapper {

    @Mapping(target = "orderItemDTOS", source = "orderItemEntities")
    OrderDTO mapToDto(OrdersEntity ordersEntity);
    @Mapping(target = "orderItemEntities", source = "orderItemDTOS")
    OrdersEntity mapToEntity(OrderDTO orderDTO);

    OrderItemDTO mapToDto(OrderItemEntity orderItemEntity);
    OrderItemEntity mapToEntity(OrderItemDTO orderItemDTO);

    List<OrderItemDTO> mapOrderItemToDto(List<OrderItemEntity> orderItemEntities);
    List<OrderItemEntity> mapOrderItemToEntity(List<OrderItemDTO> orderItemDTOS);
}
