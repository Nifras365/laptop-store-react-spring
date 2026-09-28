package laptop_store.olsbackend.controller;

import jakarta.validation.Valid;
import laptop_store.olsbackend.dto.CartDTO;
import laptop_store.olsbackend.dto.ResponseDTO;
import laptop_store.olsbackend.entity.CartEntity;
import laptop_store.olsbackend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping("/create")
    public ResponseEntity<ResponseDTO<Long>> addToTheCart(@Valid @RequestBody CartDTO cartDTO){
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
    @GetMapping("/{cartID}")
    public ResponseEntity<ResponseDTO<CartEntity>> getCartDetailsByTheId(@PathVariable Long cartID){
        Optional<CartEntity> cart = cartService.getCartDetailsById(cartID);
        return cart.map(c -> ResponseEntity.ok(new ResponseDTO<>(HttpStatus.OK.value(), "Cart item fetched successfully", c)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ResponseDTO<>(HttpStatus.NOT_FOUND.value(), "Cart item not found", null)));
    }
    @PutMapping("/update/{cartID}")
    public ResponseEntity<ResponseDTO<String>> updateCartItem(@PathVariable Long cartID, @Valid @RequestBody CartDTO cartDTO){
        cartService.updateCart(cartID, cartDTO);
        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(),
                "Cart Updated Successfully !!!", "Updated"));
    }

    @DeleteMapping("/delete/{cartID}")
    public ResponseEntity<Void> deleteCartDetail(@PathVariable Long cartID){
        cartService.deleteCartDetails(cartID);
        return ResponseEntity.noContent().build();
    }
    @DeleteMapping("/user/{userID}")
    public ResponseEntity<Void> deleteUserCart(@PathVariable Long userID){
        cartService.deleteUserCarts(userID);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userID}")
    public ResponseEntity<ResponseDTO<List<CartEntity>>> getAllCartsByUserID(@PathVariable Long userID){
        List<CartEntity> cartEntities = cartService.getCartItemsByUserID(userID);

        ResponseDTO<List<CartEntity>> response = new ResponseDTO<>(HttpStatus.OK.value(),
                "Cart details for the user fetched successfully !!!", cartEntities);

        return ResponseEntity.ok(response);
    }
}
