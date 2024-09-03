package laptop_store.olsbackend.mapper;

import laptop_store.olsbackend.dto.UsersDTO;
import laptop_store.olsbackend.entity.UsersEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsersMapper {
    UsersDTO mapToDto(UsersEntity usersEntity);
    UsersEntity mapToEntity(UsersDTO usersDTO);
}
