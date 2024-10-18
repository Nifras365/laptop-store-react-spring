package laptop_store.olsbackend.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.Map;

public class OrdersEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long OrderId;
    private Long UserID;
    private Map<String, Integer> orderItems;
    private Long FinalPrice;
}
