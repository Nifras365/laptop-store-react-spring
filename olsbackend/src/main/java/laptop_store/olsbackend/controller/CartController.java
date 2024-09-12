package laptop_store.olsbackend.controller;

import laptop_store.olsbackend.dto.CartDTO;
import laptop_store.olsbackend.dto.ResponseDTO;
import laptop_store.olsbackend.entity.CartEntity;
import laptop_store.olsbackend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping("/get-all")
    public ResponseEntity<ResponseDTO<List<CartEntity>>> getAllCarts(){
        List<CartEntity> cartEntities = cartService.getAllCartDetails();

        ResponseDTO<List<CartEntity>> listResponseDTO = new ResponseDTO<>(HttpStatus.OK.value(),
                "All Cart details fetched successfully !!!", cartEntities);

        return ResponseEntity.ok(listResponseDTO);
    }
}
