package laptop_store.olsbackend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseDTO<T>{

    private Integer status;
    private String message;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private T data;
    public ResponseDTO(Integer status, String message){
        this.status = status;
        this.message = message;
    }
}
