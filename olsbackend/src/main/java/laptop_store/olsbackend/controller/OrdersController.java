package laptop_store.olsbackend.controller;

import laptop_store.olsbackend.dto.OrderDTO;
import laptop_store.olsbackend.dto.ResponseDTO;
import laptop_store.olsbackend.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrdersController {
    @Autowired
    private OrdersService ordersService;
    @PostMapping("/create")
    public ResponseEntity<ResponseDTO<Long>> createOrder(@RequestBody OrderDTO orderDTO){
        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(),
                "Order Placed Successfully!!!"));
    }
}
