package laptop_store.olsbackend.dto;

import java.util.Map;

public class OrderDTO {
    private Long UserID;
    private Map<String, Integer> orderItems;
    private Long FinalPrice;
}
