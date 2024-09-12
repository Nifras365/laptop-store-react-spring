package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.CartDTO;

public interface CartService {
    Long addToCart(CartDTO cartDTO);
}
