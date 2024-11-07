package laptop_store.olsbackend.controller;

import laptop_store.olsbackend.dto.LoginDTO;
import laptop_store.olsbackend.dto.ResponseDTO;
import laptop_store.olsbackend.dto.UsersDTO;
import laptop_store.olsbackend.entity.UsersEntity;
import laptop_store.olsbackend.service.UsersService;
import laptop_store.olsbackend.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
                if (existingUserCheck.get().getPassword().equals(password)) {

                    Map<String, Object> claims = new HashMap<>();
                    String role = String.valueOf(usersService.findRole(email)); // default to USER if not found
                    String token = jwtUtils.generateToken(email, claims, role);

                    Map<String, String> data = new HashMap<>();
                    data.put("token", token);
                    data.put("role", role);

                    ResponseDTO<Map<String, String>> response = new ResponseDTO<>(HttpStatus.OK.value(), "Login Successful !!", data);
                    return ResponseEntity.status(HttpStatus.OK).body(response);

                } else {
                    ResponseDTO<Map<String, String>> response = new ResponseDTO<>(HttpStatus.UNAUTHORIZED.value(), "Wrong Password !");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                }
            } else {
                ResponseDTO<Map<String, String>> response = new ResponseDTO<>(HttpStatus.NOT_FOUND.value(), "User Not found !");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            e.printStackTrace();
            ResponseDTO<Map<String, String>> response = new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Server Error !");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<ResponseDTO<Long>> getUserIdByEmail(@PathVariable String email){
        Long userID = usersService.findUserID(email);

        ResponseDTO<Long> response = new ResponseDTO<>(HttpStatus.OK.value(),
                "UserID Fetched !!!", userID);

        return ResponseEntity.ok(response);
    }
}
