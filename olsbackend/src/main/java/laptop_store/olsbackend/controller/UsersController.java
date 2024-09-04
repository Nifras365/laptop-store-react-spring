package laptop_store.olsbackend.controller;

import laptop_store.olsbackend.dto.LoginDTO;
import laptop_store.olsbackend.dto.ResponseDTO;
import laptop_store.olsbackend.dto.UsersDTO;
import laptop_store.olsbackend.service.UsersService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UsersController {
    @Autowired
    private UsersService usersService;
    @PostMapping("/create")
    public ResponseEntity<ResponseDTO<Long>> createUsers(@RequestBody UsersDTO usersDTO){
        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(), "User Created Successfully !!", usersService.createUser(usersDTO)));
    }
    @PostMapping("/login")
    public ResponseEntity<ResponseDTO<Long>> userLogin(@RequestBody LoginDTO loginDTO){
        String email = loginDTO.getEmail();
        String password = loginDTO.getPassword();

        try {
            Optional<UsersDTO> existingUserCheck = usersService.findByEmail(email);
            if (existingUserCheck.isPresent()){
                if (existingUserCheck.get().getPassword().equals(password)){
                    return ResponseEntity.status(HttpStatus.OK).body(HttpStatus.OK.value(), "Login Successful !!");
                }
                else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(HttpStatus.UNAUTHORIZED.value(), "Wrong Password !");
                }
            }
            else {
               return ResponseEntity.status(HttpStatus.NOT_FOUND).body(HttpStatus.NOT_FOUND, "User Not found !");
            }
        }
        catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(HttpStatus.INTERNAL_SERVER_ERROR, "Server Error !");
        }
    }
}
