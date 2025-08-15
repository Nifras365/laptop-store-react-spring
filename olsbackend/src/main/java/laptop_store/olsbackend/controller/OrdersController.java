package laptop_store.olsbackend.controller;

import laptop_store.olsbackend.dto.OrderDTO;
import laptop_store.olsbackend.dto.ResponseDTO;
import laptop_store.olsbackend.service.OrdersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrdersController {
    @Autowired
    private OrdersService ordersService;
    @PostMapping("/create")
    public ResponseEntity<ResponseDTO<Long>> createOrder(@RequestBody OrderDTO orderDTO){

        Long order = ordersService.createOrder(orderDTO);

        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(),
                "Order Placed Successfully!!!", order));
    }

    @GetMapping("/get-all")
    public ResponseEntity<ResponseDTO<List<OrderDTO>>> getAllOrders(){
        List<OrderDTO> orders = ordersService.getAllOrders();

        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(),
                "Orders Fetched Successfully !!!", orders));
    }

    @GetMapping("/user/{userID}")
    public  ResponseEntity<ResponseDTO<List<OrderDTO>>> getOrderById(@PathVariable Long userID){
        List<OrderDTO> orders = ordersService.getOrderByUserID(userID);

        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(),
                "User Orders Fetched Successfully !!!", orders));
    }
}
