package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.WishlistDTO;
import laptop_store.olsbackend.entity.WishlistEntity;

import java.util.List;

public interface WishlistService {
    void addToWishlist(WishlistDTO wishlistDTO);
    void removeFromWishlist(Long userId, Long laptopId);
    List<WishlistEntity> getWishlistByUserId(Long userId);
    boolean isInWishlist(Long userId, Long laptopId);
}
