package laptop_store.olsbackend.mapper;

import laptop_store.olsbackend.dto.CartDTO;
import laptop_store.olsbackend.entity.CartEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CartMapper {
    CartDTO mapToDto(CartEntity cartEntity);
    CartEntity mapToEntity(CartDTO cartDTO);
}
