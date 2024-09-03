package laptop_store.olsbackend.exceptions;

import laptop_store.olsbackend.dto.ResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CustomExceptionHandler {
    @ExceptionHandler(ItemAlreadyExistsException.class)
    public ResponseEntity<ResponseDTO> handleItemAlreadyExistsException(ItemAlreadyExistsException exception){
        ResponseDTO responseDTO = new ResponseDTO(HttpStatus.CONTINUE.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(responseDTO);
    }
}
