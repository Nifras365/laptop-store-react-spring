package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.CartDTO;
import laptop_store.olsbackend.entity.CartEntity;
import laptop_store.olsbackend.entity.LaptopEntity;
import laptop_store.olsbackend.exceptions.ItemNotFoundException;
import laptop_store.olsbackend.exceptions.OutOfRangeException;
import laptop_store.olsbackend.mapper.CartMapper;
import laptop_store.olsbackend.repository.CartRepository;
import laptop_store.olsbackend.repository.LaptopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService{
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private LaptopRepository laptopRepository;
    @Autowired
    private CartMapper cartMapper;
    @Override
    public Long addToCart(CartDTO cartDTO){

        Optional<LaptopEntity> laptopAvailability = laptopRepository.findById(cartDTO.getLaptopID());

        if (laptopAvailability.isPresent()){

            LaptopEntity laptop = laptopAvailability.get();

            if (laptop.getStockQuantity() < cartDTO.getQuantity()){
                throw new OutOfRangeException("Requested quantity exceeds available stock !!!");
            }

            return cartRepository.save(CartEntity.builder()
                    .userID(cartDTO.getUserID())
                    .laptopID(cartDTO.getLaptopID())
                    .quantity(cartDTO.getQuantity())
                    .totalPrice(cartDTO.getTotalPrice())
                    .build()).getCartID();
        }
        else {
            throw new ItemNotFoundException("Laptop Doesn't exist with given laptop id ");
        }
    }
    @Override
    public List<CartEntity> getAllCartDetails(){
        return cartRepository.findAll();
    }
    @Override
    public Optional<CartEntity> getCartDetailsById(Long cartID){
        return cartRepository.findById(cartID);
    }
    @Override
    public void deleteCartDetails(Long cartID){
        cartRepository.deleteById(cartID);
    }

}
