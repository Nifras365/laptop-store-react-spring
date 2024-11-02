package laptop_store.olsbackend.service;

import jakarta.annotation.PostConstruct;
import laptop_store.olsbackend.dto.UsersDTO;
import laptop_store.olsbackend.entity.UsersEntity;
import laptop_store.olsbackend.exceptions.ItemAlreadyExistsException;
import laptop_store.olsbackend.exceptions.ItemNotFoundException;
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

    @PostConstruct
    public void createAdminIfNotExist(){
        Optional<UsersEntity> adminCheck = usersRepository.findByRole("ADMIN");

        if (adminCheck.isEmpty()){
            UsersEntity admin = UsersEntity.builder()
                    .email("admin@gmail.com")
                    .password("")
                    .name("Admin")
                    .role("ADMIN")
                    .build();
            usersRepository.save(admin);
        }
    }

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
                .country(usersDTO.getCountry())
                .role("USER")
                .build()).getUserId();

    }
    public Optional<UsersDTO> findByEmail(String email){
        return usersRepository.findByEmail(email).map(usersMapper::mapToDto);
    }
    public Optional<String> findRole(String email){
        Optional<UsersEntity> existingUser = usersRepository.findByEmail(email);
        if (existingUser.isPresent()){
            return Optional.of(existingUser.get().getRole());
        }
        else {
            throw new ItemNotFoundException("User doesn't exist with this email !!!");
        }
    }
}
