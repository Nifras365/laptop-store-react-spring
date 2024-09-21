package laptop_store.olsbackend.exceptions;

import laptop_store.olsbackend.dto.ResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CustomExceptionHandler {
    @ExceptionHandler(ItemAlreadyExistsException.class)
    public ResponseEntity<ResponseDTO<Void>> handleItemAlreadyExistsException(ItemAlreadyExistsException exception){
        ResponseDTO<Void> responseDTO = new ResponseDTO<>(HttpStatus.CONFLICT.value(), exception.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(responseDTO);
    }
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ResponseDTO<Void>> handleUnauthorizedException(UnauthorizedException e){
        ResponseDTO<Void> responseDTO1 = new ResponseDTO<>(HttpStatus.UNAUTHORIZED.value(), e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(responseDTO1);
    }
    @ExceptionHandler(ItemNotFoundException.class)
    public ResponseEntity<ResponseDTO<Void>> handleItemNotFoundException(ItemNotFoundException ie){
        ResponseDTO<Void> responseDTO2 = new ResponseDTO<>(HttpStatus.NOT_FOUND.value(), ie.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(responseDTO2);
    }
    @ExceptionHandler(OutOfRangeException.class)
    public ResponseEntity<ResponseDTO<Void>> handleOutOfRangeException(OutOfRangeException oe){
        ResponseDTO<Void> responseDTO3 = new ResponseDTO<>(HttpStatus.BAD_REQUEST.value(), oe.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseDTO3);
    }
}
