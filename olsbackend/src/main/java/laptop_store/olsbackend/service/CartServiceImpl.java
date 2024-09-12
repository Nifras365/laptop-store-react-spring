package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.CartDTO;
import laptop_store.olsbackend.entity.CartEntity;
import laptop_store.olsbackend.mapper.CartMapper;
import laptop_store.olsbackend.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CartServiceImpl implements CartService{
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartMapper cartMapper;
    @Override
    public Long addToCart(CartDTO cartDTO){
        return cartRepository.save(CartEntity.builder()
                .laptopID(cartDTO.getLaptopID())
                .quantity(cartDTO.getQuantity())
                .totalPrice(cartDTO.getTotalPrice()).build()).getCartID();
    }
}
