package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.CartDTO;
import laptop_store.olsbackend.entity.CartEntity;

import java.util.List;

public interface CartService {
    Long addToCart(CartDTO cartDTO);
    List<CartEntity> getAllCartDetails();
}
