package laptop_store.olsbackend.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDTO {
    private Long orderId;

    @NotNull(message = "User ID is required")
    private Long userID;

    @NotNull(message = "Order items are required")
    @Size(min = 1, message = "Order must have at least one item")
    private List<OrderItemDTO> orderItemDTOS;

    @NotNull(message = "Final price is required")
    @Positive(message = "Final price must be a positive number")
    private Long finalPrice;

    private String status;
    private LocalDateTime createdAt;
}
