package laptop_store.olsbackend.controller;

import laptop_store.olsbackend.dto.UsersDTO;
import laptop_store.olsbackend.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UsersController {
    @Autowired
    private UsersService usersService;
    @PostMapping("/create")
    public UsersDTO createUsers(@RequestBody UsersDTO usersDTO){
        return usersService.createUser(usersDTO);
    }
}
