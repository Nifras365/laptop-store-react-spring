package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.CartDTO;
import laptop_store.olsbackend.entity.CartEntity;

import java.util.List;
import java.util.Optional;

public interface CartService {
    Long addToCart(CartDTO cartDTO);
    List<CartEntity> getAllCartDetails();
    Optional<CartEntity> getCartDetailsById(Long cartID);
    void deleteCartDetails(Long cartID);
    List<CartEntity> getCartItemsByUserID(Long userID);
}
