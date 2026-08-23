package laptop_store.olsbackend.controller;

import laptop_store.olsbackend.dto.ResponseDTO;
import laptop_store.olsbackend.dto.WishlistDTO;
import laptop_store.olsbackend.entity.WishlistEntity;
import laptop_store.olsbackend.service.WishlistService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/wishlist")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @PostMapping("/add")
    public ResponseEntity<ResponseDTO<Void>> addToWishlist(@RequestBody WishlistDTO wishlistDTO) {
        log.info("Received request to add laptop ID {} to wishlist for user ID {}", wishlistDTO.getLaptopId(), wishlistDTO.getUserId());
        try {
            wishlistService.addToWishlist(wishlistDTO);
            log.info("Successfully added laptop ID {} to wishlist for user ID {}", wishlistDTO.getLaptopId(), wishlistDTO.getUserId());
            return ResponseEntity.ok(new ResponseDTO<>(HttpStatus.OK.value(), "Added to wishlist successfully", null));
        } catch (Exception e) {
            log.error("Error adding to wishlist: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Failed to add to wishlist", null));
        }
    }

    @DeleteMapping("/remove/{userId}/{laptopId}")
    public ResponseEntity<ResponseDTO<Void>> removeFromWishlist(@PathVariable Long userId, @PathVariable Long laptopId) {
        log.info("Received request to remove laptop ID {} from wishlist for user ID {}", laptopId, userId);
        try {
            wishlistService.removeFromWishlist(userId, laptopId);
            log.info("Successfully removed laptop ID {} from wishlist for user ID {}", laptopId, userId);
            return ResponseEntity.ok(new ResponseDTO<>(HttpStatus.OK.value(), "Removed from wishlist successfully", null));
        } catch (Exception e) {
            log.error("Error removing from wishlist: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Failed to remove from wishlist", null));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ResponseDTO<List<WishlistEntity>>> getWishlistByUserId(@PathVariable Long userId) {
        log.info("Received request to fetch wishlist for user ID {}", userId);
        try {
            List<WishlistEntity> wishlist = wishlistService.getWishlistByUserId(userId);
            log.info("Successfully fetched wishlist for user ID {}. Items: {}", userId, wishlist.size());
            return ResponseEntity.ok(new ResponseDTO<>(HttpStatus.OK.value(), "Fetched wishlist successfully", wishlist));
        } catch (Exception e) {
            log.error("Error fetching wishlist for user ID {}: ", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Failed to fetch wishlist", null));
        }
    }

    @GetMapping("/check/{userId}/{laptopId}")
    public ResponseEntity<ResponseDTO<Boolean>> checkWishlist(@PathVariable Long userId, @PathVariable Long laptopId) {
        boolean isInWishlist = wishlistService.isInWishlist(userId, laptopId);
        return ResponseEntity.ok(new ResponseDTO<>(HttpStatus.OK.value(), "Checked wishlist successfully", isInWishlist));
    }
}
