package laptop_store.olsbackend.controller;

import laptop_store.olsbackend.dto.CartDTO;
import laptop_store.olsbackend.dto.ResponseDTO;
import laptop_store.olsbackend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {
    @Autowired
    private CartService cartService;
    @PostMapping("/create")
    public ResponseEntity<ResponseDTO<Long>> addToTheCart(@RequestBody CartDTO cartDTO){
        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(),
                "Laptop Added To Cart Successfully !!!", cartService.addToCart(cartDTO)));
    }
}
