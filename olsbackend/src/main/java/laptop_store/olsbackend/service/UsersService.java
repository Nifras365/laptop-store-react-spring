package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.UsersDTO;

import java.util.Optional;

public interface UsersService {
    Long createUser(UsersDTO usersDTO);
    Optional<UsersDTO> findByEmail(String email);

}
