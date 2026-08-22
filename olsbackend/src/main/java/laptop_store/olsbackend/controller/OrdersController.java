package laptop_store.olsbackend.controller;

import laptop_store.olsbackend.dto.OrderDTO;
import laptop_store.olsbackend.dto.ResponseDTO;
import laptop_store.olsbackend.service.OrdersService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class OrdersController {
    @Autowired
    private OrdersService ordersService;
    @PostMapping("/create")
    public ResponseEntity<ResponseDTO<Long>> createOrder(@RequestBody OrderDTO orderDTO){

        Long order = ordersService.createOrder(orderDTO);

        log.info("Successfully created order with ID: {}", order);

        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(),
                "Order Placed Successfully!!!", order));
    }

    @GetMapping("/get-all")
    public ResponseEntity<ResponseDTO<List<OrderDTO>>> getAllOrders(){
        List<OrderDTO> orders = ordersService.getAllOrders();

        log.info("Fetched all orders, total count: {}", orders.size());

        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(),
                "Orders Fetched Successfully !!!", orders));
    }

    @GetMapping("/user/{userID}")
    public  ResponseEntity<ResponseDTO<List<OrderDTO>>> getOrderById(@PathVariable Long userID){
        List<OrderDTO> orders = ordersService.getOrderByUserID(userID);

        log.info("Fetched orders for user ID: {}, total count: {}", userID, orders.size());

        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(),
                "User Orders Fetched Successfully !!!", orders));
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<ResponseDTO<String>> cancelOrder(@PathVariable Long orderId) {
        log.info("Received request to cancel order ID: {}", orderId);
        try {
            ordersService.cancelOrder(orderId);
            return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(),
                    "Order Cancelled Successfully !!!", "Cancelled"));
        } catch (IllegalStateException e) {
            log.error("Failed to cancel order ID: {} - {}", orderId, e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ResponseDTO<>(HttpStatus.BAD_REQUEST.value(),
                    e.getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error cancelling order ID: {}", orderId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    "Internal server error", null));
        }
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<ResponseDTO<String>> updateOrderStatus(@PathVariable Long orderId, @RequestParam String status) {
        log.info("Received request to update status for order ID: {} to {}", orderId, status);
        ordersService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(),
                "Order status updated successfully", status));
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        log.info("Received request to delete order ID: {}", orderId);
        try {
            ordersService.deleteOrder(orderId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting order ID: {}", orderId, e);
            throw e;
        }
    }
}
