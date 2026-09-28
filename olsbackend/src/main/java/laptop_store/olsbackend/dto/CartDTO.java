package laptop_store.olsbackend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartDTO {
    @NotNull(message = "User ID is required")
    private Long userID;

    @NotNull(message = "Laptop ID is required")
    private Long laptopID;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be a positive number")
    private Integer quantity;

    private Long totalPrice;
}
