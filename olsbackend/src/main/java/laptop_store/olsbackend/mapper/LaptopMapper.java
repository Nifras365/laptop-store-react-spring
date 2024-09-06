package laptop_store.olsbackend.mapper;

import laptop_store.olsbackend.dto.LaptopDTO;
import laptop_store.olsbackend.entity.LaptopEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface LaptopMapper {
    LaptopDTO mapToDto(LaptopEntity laptopEntity);
    LaptopEntity mapToEntity(LaptopDTO laptopDTO);
}
