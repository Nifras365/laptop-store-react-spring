package laptop_store.olsbackend.dto;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsersDTO {
    private String role;
    private String email;
    private String name;
    private String password;
    private String confirmPassword;
    private Long phone;
    private String address;
    private String country;
}
