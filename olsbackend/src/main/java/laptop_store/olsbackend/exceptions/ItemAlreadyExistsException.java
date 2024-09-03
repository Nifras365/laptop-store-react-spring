package laptop_store.olsbackend.exceptions;

public class ItemAlreadyExistsException extends RuntimeException{
    public ItemAlreadyExistsException(String message){
        super(message);
    }
}
