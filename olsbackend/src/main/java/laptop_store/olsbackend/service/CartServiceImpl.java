package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.CartDTO;
import laptop_store.olsbackend.entity.CartEntity;
import laptop_store.olsbackend.entity.LaptopEntity;
import laptop_store.olsbackend.exceptions.ItemNotFoundException;
import laptop_store.olsbackend.exceptions.OutOfRangeException;
import laptop_store.olsbackend.mapper.CartMapper;
import laptop_store.olsbackend.repository.CartRepository;
import laptop_store.olsbackend.repository.LaptopRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
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
                log.info("Requested quantity exceeds available stock. Laptop ID: {}, Requested Quantity: {}, Available Stock: {}",
                        cartDTO.getLaptopID(), cartDTO.getQuantity(), laptop.getStockQuantity());
                throw new OutOfRangeException("Requested quantity exceeds available stock !!!");
            }

            //update stock
            laptop.setStockQuantity(laptop.getStockQuantity() - cartDTO.getQuantity());
            laptopRepository.save(laptop);

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
    public void updateCart(Long cartID, CartDTO cartDTO){
        CartEntity cartEntity = cartRepository.findById(cartID)
                .orElseThrow(() -> new ItemNotFoundException("Cart item not found with ID: " + cartID));

        if (cartDTO.getQuantity() != null) {
            if (cartDTO.getQuantity() <= 0) {
                throw new OutOfRangeException("Quantity must be greater than zero.");
            }
            LaptopEntity laptop = laptopRepository.findById(cartEntity.getLaptopID())
                    .orElseThrow(() -> new ItemNotFoundException("Laptop not found with ID: " + cartEntity.getLaptopID()));

            int quantityDifference = cartDTO.getQuantity() - cartEntity.getQuantity();

            if (quantityDifference > 0 && laptop.getStockQuantity() < quantityDifference) {
                log.info("Requested quantity exceeds available stock. Laptop ID: {}, Requested Quantity: {}, Available Stock: {}",
                        cartEntity.getLaptopID(), cartDTO.getQuantity(), laptop.getStockQuantity());
                throw new OutOfRangeException("Requested quantity exceeds available stock.");
            }

            laptop.setStockQuantity(laptop.getStockQuantity() - quantityDifference);
            laptopRepository.save(laptop);

            cartEntity.setQuantity(cartDTO.getQuantity());
            cartEntity.setTotalPrice((long) laptop.getPrice() * cartDTO.getQuantity());
        }
        cartRepository.save(cartEntity);
    }

    @Override
    public void deleteCartDetails(Long cartID){
        Optional<CartEntity> cartOpt = cartRepository.findById(cartID);
        if (cartOpt.isPresent()) {
            CartEntity cartEntity = cartOpt.get();
            laptopRepository.findById(cartEntity.getLaptopID()).ifPresent(laptop -> {
                laptop.setStockQuantity(laptop.getStockQuantity() + cartEntity.getQuantity());
                laptopRepository.save(laptop);
            });
            cartRepository.deleteById(cartID);
        }
    }

    @Override
    public void deleteUserCarts(Long userID){
        cartRepository.deleteByUserID(userID);
    }
    @Override
    public List<CartEntity> getCartItemsByUserID(Long userID){
        List<CartEntity> cartEntities = cartRepository.findByUserID(userID);

        if (cartEntities.isEmpty()){
            throw new ItemNotFoundException("No carts found for the given user ID.");
        }

        return cartEntities;
    }

}
