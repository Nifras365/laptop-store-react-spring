package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.UsersDTO;
import laptop_store.olsbackend.entity.UsersEntity;
import laptop_store.olsbackend.exceptions.ItemAlreadyExistsException;
import laptop_store.olsbackend.exceptions.UnauthorizedException;
import laptop_store.olsbackend.mapper.UsersMapper;
import laptop_store.olsbackend.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsersServiceImpl implements UsersService{
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private UsersMapper usersMapper;
    @Override
    public Long createUser(UsersDTO usersDTO){

        Optional<UsersEntity> existingUsers = usersRepository.findByEmail(usersDTO.getEmail());

        if (existingUsers.isPresent()){
            throw new ItemAlreadyExistsException("User with given email already exists : " + usersDTO.getEmail());
        }
        if (!usersDTO.getPassword().equals(usersDTO.getConfirmPassword())){
            throw new UnauthorizedException("Password didn't match !!!: " + usersDTO.getPassword());
        }
        return usersRepository.save(UsersEntity.builder()
                .email(usersDTO.getEmail())
                .name(usersDTO.getName())
                .password(usersDTO.getPassword())
                .confirmPassword(usersDTO.getConfirmPassword())
                .phone(usersDTO.getPhone())
                .address(usersDTO.getAddress())
                .country(usersDTO.getCountry()).build()).getUserId();

    }
    public Optional<UsersDTO> findByEmail(String email){
        return usersRepository.findByEmail(email).map(usersMapper::mapToDto);
    }
}
