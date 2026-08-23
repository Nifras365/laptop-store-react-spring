package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.WishlistDTO;
import laptop_store.olsbackend.entity.WishlistEntity;
import laptop_store.olsbackend.repository.WishlistRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@Slf4j
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Override
    public void addToWishlist(WishlistDTO wishlistDTO) {
        log.info("Attempting to add laptop ID {} to wishlist for user ID {}", wishlistDTO.getLaptopId(), wishlistDTO.getUserId());
        if (!isInWishlist(wishlistDTO.getUserId(), wishlistDTO.getLaptopId())) {
            WishlistEntity entity = WishlistEntity.builder()
                    .userId(wishlistDTO.getUserId())
                    .laptopId(wishlistDTO.getLaptopId())
                    .build();
            wishlistRepository.save(entity);
            log.info("Successfully added laptop ID {} to wishlist for user ID {}", wishlistDTO.getLaptopId(), wishlistDTO.getUserId());
        } else {
            log.info("Laptop ID {} is already in wishlist for user ID {}", wishlistDTO.getLaptopId(), wishlistDTO.getUserId());
        }
    }

    @Override
    public void removeFromWishlist(Long userId, Long laptopId) {
        log.info("Removing laptop ID {} from wishlist for user ID {}", laptopId, userId);
        wishlistRepository.deleteByUserIdAndLaptopId(userId, laptopId);
        log.info("Successfully removed laptop ID {} from wishlist for user ID {}", laptopId, userId);
    }

    @Override
    public List<WishlistEntity> getWishlistByUserId(Long userId) {
        log.info("Fetching wishlist for user ID {}", userId);
        List<WishlistEntity> wishlist = wishlistRepository.findByUserId(userId);
        log.info("Found {} items in wishlist for user ID {}", wishlist.size(), userId);
        return wishlist;
    }

    @Override
    public boolean isInWishlist(Long userId, Long laptopId) {
        return wishlistRepository.findByUserIdAndLaptopId(userId, laptopId).isPresent();
    }
}
