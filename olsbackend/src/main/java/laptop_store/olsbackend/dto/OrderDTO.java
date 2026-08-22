package laptop_store.olsbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDTO {
    private Long orderId;
    private Long userID;
    private List<OrderItemDTO> orderItemDTOS;
    private Long finalPrice;
    private String status;
    private LocalDateTime createdAt;
}
