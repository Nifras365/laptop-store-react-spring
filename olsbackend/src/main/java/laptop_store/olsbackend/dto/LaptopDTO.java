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
    private String email;
    private String name;
    private String password;
    private String confirmPassword;
    private Long phone;
    private String address;
    private String country;
}
