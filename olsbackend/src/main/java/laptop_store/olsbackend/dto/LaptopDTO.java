package laptop_store.olsbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LaptopDTO {
    private String image;
    private String description;
    private Integer price;
    private String brand;
    private String model;
    private String specifications;
    private Integer stockQuantity;
}
