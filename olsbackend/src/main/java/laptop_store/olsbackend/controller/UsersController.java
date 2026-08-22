package laptop_store.olsbackend.controller;

import laptop_store.olsbackend.dto.LoginDTO;
import laptop_store.olsbackend.dto.ResponseDTO;
import laptop_store.olsbackend.dto.UsersDTO;
import laptop_store.olsbackend.dto.ChangePasswordDTO;
import laptop_store.olsbackend.entity.UsersEntity;
import laptop_store.olsbackend.service.UsersService;
import laptop_store.olsbackend.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UsersController {
    @Autowired
    private UsersService usersService;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/create")
    public ResponseEntity<ResponseDTO<Long>> createUsers(@RequestBody UsersDTO usersDTO){
        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(), "User Created Successfully !!", usersService.createUser(usersDTO)));
    }
    @PostMapping("/login")
    public ResponseEntity<ResponseDTO<Map<String, String>>> userLogin(@RequestBody LoginDTO loginDTO) {
        String email = loginDTO.getEmail();
        String password = loginDTO.getPassword();

        try {
            Optional<UsersDTO> existingUserCheck = usersService.findByEmail(email);
            if (existingUserCheck.isPresent()) {
                UsersDTO user = existingUserCheck.get();

                boolean passwordMatches = false;
                try {
                    passwordMatches = passwordEncoder.matches(password, user.getPassword());
                } catch (IllegalArgumentException e) {
                    passwordMatches = false;
                }

                if (passwordMatches) {
                    String role = usersService.findRole(email)
                            .orElseThrow(() -> new RuntimeException("Role not found"));

                    Map<String, Object> claims = new HashMap<>();

                    String token = jwtUtils.generateToken(email, claims, role);

                    Map<String, String> data = new HashMap<>();
                    data.put("token", token);
                    data.put("userRole", role);

                    ResponseDTO<Map<String, String>> response =
                            new ResponseDTO<>(HttpStatus.OK.value(), "Login Successful !!", data);

                    return ResponseEntity.ok(response);
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new ResponseDTO<>(HttpStatus.UNAUTHORIZED.value(), "Wrong Password !"));
                }
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>(HttpStatus.NOT_FOUND.value(), "User Not Found !"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Server Error !"));
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<ResponseDTO<Long>> getUserIdByEmail(@PathVariable String email){
        Long userID = usersService.findUserID(email);

        ResponseDTO<Long> response = new ResponseDTO<>(HttpStatus.OK.value(),
                "UserID Fetched !!!", userID);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/id/{userId}")
    public ResponseEntity<ResponseDTO<String>> getUserNameByID(@PathVariable Long userId){
        String userName = usersService.findUserName(userId);

        ResponseDTO<String> responseDTO = new ResponseDTO<>(HttpStatus.OK.value(),
                "Username : ", userName);

        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/userdetails/{userId}")
    public ResponseEntity<ResponseDTO<List<UsersDTO>>> getUserDetails(@PathVariable Long userId){
        List<UsersDTO> usersDTOList = usersService.getUserDetailsDTOById(userId);

        ResponseDTO<List<UsersDTO>> responseDTO1 = new ResponseDTO<>(
                HttpStatus.OK.value(),
                "User details fetched !!!",
                usersDTOList
        );

        return ResponseEntity.ok(responseDTO1);
    }

    @GetMapping("/get-all")
    public ResponseEntity<ResponseDTO<List<UsersDTO>>> getAllUsers(){
        List<UsersDTO> users = usersService.getAllUsers();

        return ResponseEntity.ok(new ResponseDTO<>(HttpStatus.OK.value(),
                "All users fetched successfully !!!", users));
    }

    @PutMapping("/update-user/{userId}")
    public ResponseEntity<ResponseDTO<String>> updateUser(@PathVariable Long userId, @RequestBody UsersDTO usersDTO){
        usersService.updateUser(userId, usersDTO);

        return ResponseEntity.ok(new ResponseDTO<>(HttpStatus.OK.value(),
                "User updated successfully !!!", "Updated"));
    }

    @PutMapping("/{userId}/change-password")
    public ResponseEntity<ResponseDTO<String>> changePassword(@PathVariable Long userId, @RequestBody ChangePasswordDTO changePasswordDTO) {
        try {
            usersService.changePassword(userId, changePasswordDTO.getOldPassword(), changePasswordDTO.getNewPassword());
            return ResponseEntity.ok(new ResponseDTO<>(HttpStatus.OK.value(), "Password changed successfully!", "Changed"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null));
        }
    }

    @DeleteMapping("/delete-user/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId){
        usersService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}