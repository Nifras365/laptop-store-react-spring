package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.UsersDTO;
import laptop_store.olsbackend.entity.UsersEntity;

import java.util.List;
import java.util.Optional;

public interface UsersService {
    Long createUser(UsersDTO usersDTO);
    Optional<UsersDTO> findByEmail(String email);
    void createAdminIfNotExist();
    Optional<String> findRole(String email);
    Long findUserID(String email);
    String findUserName(Long userId);
    List<UsersEntity> getUserDetailsById(Long userId);
}
