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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import lombok.extern.slf4j.Slf4j;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class UsersServiceImpl implements UsersService{
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private UsersMapper usersMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @PostConstruct

    public void createAdminIfNotExist(){
        Optional<UsersEntity> adminCheck = usersRepository.findByRole("ADMIN");

        if (adminCheck.isEmpty()){
            UsersEntity admin = UsersEntity.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .name("Admin")
                    .role("ADMIN")
                    .build();
            usersRepository.save(admin);
            log.info("Default Admin user created successfully with email: {}", adminEmail);
        } else {
            log.info("Admin user already exists, skipping creation.");
        }
    }

    @Override
    public Long createUser(UsersDTO usersDTO){

        Optional<UsersEntity> existingUsers = usersRepository.findByEmail(usersDTO.getEmail());

        if (existingUsers.isPresent()){
            throw new ItemAlreadyExistsException("User with given email already exists : " + usersDTO.getEmail());
        }
        if (!usersDTO.getPassword().equals(usersDTO.getConfirmPassword())){
            throw new UnauthorizedException("Password didn't match !!!");
        }
        Long savedUserId = usersRepository.save(UsersEntity.builder()
                .email(usersDTO.getEmail())
                .name(usersDTO.getName())
                .password(passwordEncoder.encode(usersDTO.getPassword()))
                .phone(usersDTO.getPhone())
                .address(usersDTO.getAddress())
                .country(usersDTO.getCountry())
                .role("USER")
                .build()).getUserId();

        log.info("New user registered successfully with ID: {} and email: {}", savedUserId, usersDTO.getEmail());
        
        return savedUserId;
    }

    @Override
    public Optional<UsersDTO> findByEmail(String email){
        return usersRepository.findByEmail(email).map(usersMapper::mapToDto);
    }
    @Override
    public Optional<String> findRole(String email){
        Optional<UsersEntity> existingUser = usersRepository.findByEmail(email);
        if (existingUser.isPresent()){
            return Optional.of(existingUser.get().getRole());
        }
        else {
            throw new ItemNotFoundException("User doesn't exist with this email !!!");
        }
    }
    @Override
    public Long findUserID(String email){
        UsersEntity entity = usersRepository.findByEmail(email)
                .orElseThrow(()-> new ItemNotFoundException("User doesn't exist with this email !!!"));
        return entity.getUserId();
    }
    @Override
    public String findUserName(Long userId){
        UsersEntity entity1 = usersRepository.findByUserId(userId)
                .orElseThrow(()-> new ItemNotFoundException("User doesn't exist with this UserId !!!"));
        return entity1.getName();
    }

    @Override
    public List<UsersEntity> getUserDetailsById(Long userId){
        UsersEntity usersEntity = usersRepository.findByUserId(userId)
                .orElseThrow(()-> new ItemNotFoundException("User doesn't exist with this UserId !!!"));

        return Collections.singletonList(usersEntity);
    }

    @Override
    public List<UsersDTO> getUserDetailsDTOById(Long userId){
        UsersEntity usersEntity = usersRepository.findByUserId(userId)
                .orElseThrow(()-> new ItemNotFoundException("User doesn't exist with this UserId !!!"));

        return Collections.singletonList(usersMapper.mapToDto(usersEntity));
    }

    @Override
    public List<UsersDTO> getAllUsers(){
        return usersRepository.findAll().stream()
                .map(usersMapper::mapToDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public void updateUser(Long userId, UsersDTO usersDTO){
        UsersEntity usersEntity = usersRepository.findByUserId(userId)
                .orElseThrow(()-> new ItemNotFoundException("User doesn't exist with this UserId !!!"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && authentication.getName() != null && !authentication.getName().equals(usersEntity.getEmail())) {
            throw new UnauthorizedException("You are not authorized to update this profile.");
        }

        if (usersDTO.getName() != null) usersEntity.setName(usersDTO.getName());
        if (usersDTO.getEmail() != null) usersEntity.setEmail(usersDTO.getEmail());
        if (usersDTO.getPhone() != null) usersEntity.setPhone(usersDTO.getPhone());
        if (usersDTO.getAddress() != null) usersEntity.setAddress(usersDTO.getAddress());
        if (usersDTO.getCountry() != null) usersEntity.setCountry(usersDTO.getCountry());
        
        if (usersDTO.getRole() != null && isAdmin) {
            usersEntity.setRole(usersDTO.getRole());
        }

        log.info("Updating user ID: {} with new details: {}", userId, usersDTO);

        usersRepository.save(usersEntity);
    }

    @Override
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        UsersEntity user = usersRepository.findByUserId(userId)
                .orElseThrow(() -> new ItemNotFoundException("User doesn't exist with this UserId !!!"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new UnauthorizedException("Old password does not match!");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        usersRepository.save(user);
        log.info("Password changed successfully for user ID: {}", userId);
    }

    @Override
    public void deleteUser(Long userId){
        UsersEntity usersEntity = usersRepository.findByUserId(userId)
                .orElseThrow(()-> new ItemNotFoundException("User doesn't exist with this UserId !!!"));
        usersRepository.delete(usersEntity);
    }
}
