package laptop_store.olsbackend.dto;

import lombok.Data;

@Data
public class ResponseDTO {

    private Integer status;
    private String message;
    public ResponseDTO(Integer status, String message){
        this.status = status;
        this.message = message;
    }
}
