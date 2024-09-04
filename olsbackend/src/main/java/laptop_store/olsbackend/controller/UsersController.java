package laptop_store.olsbackend.controller;

import laptop_store.olsbackend.dto.LoginDTO;
import laptop_store.olsbackend.dto.ResponseDTO;
import laptop_store.olsbackend.dto.UsersDTO;
import laptop_store.olsbackend.service.UsersService;
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
                    ResponseDTO<Long> response = new ResponseDTO<>(HttpStatus.OK.value(), "Login Successful !!");
                    return ResponseEntity.status(HttpStatus.OK).body(response);
                }
                else {
                    ResponseDTO<Long> response = new ResponseDTO<>(HttpStatus.UNAUTHORIZED.value(), "Wrong Password !");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                }
            }
            else {
                ResponseDTO<Long> response = new ResponseDTO<>(HttpStatus.NOT_FOUND.value(), "User Not found !");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        }
        catch (Exception e){
            e.printStackTrace();
            ResponseDTO<Long> response = new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Server Error !");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
