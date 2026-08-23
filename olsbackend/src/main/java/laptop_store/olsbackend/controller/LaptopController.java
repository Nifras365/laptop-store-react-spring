package laptop_store.olsbackend.controller;

import laptop_store.olsbackend.dto.LaptopDTO;
import laptop_store.olsbackend.dto.ResponseDTO;
import laptop_store.olsbackend.entity.LaptopEntity;
import laptop_store.olsbackend.service.LaptopService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/laptops")
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class LaptopController {
    @Autowired
    private LaptopService laptopService;
    @PostMapping("/create")
    public ResponseEntity<ResponseDTO<Long>> createLaptops(@RequestBody LaptopDTO laptopDTO){
        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(),
                "Laptop added successfully !!!", laptopService.createLaptop(laptopDTO)));
    }
    @GetMapping("/get-all")
    public ResponseEntity<ResponseDTO<List<LaptopEntity>>> getAll(){
        List<LaptopEntity> laptopEntities = laptopService.getAllLaptops();

        ResponseDTO<List<LaptopEntity>> listResponseDTO = new ResponseDTO<>(HttpStatus.OK.value(),
                "Successfully fetched all data <3", laptopEntities);

        return ResponseEntity.ok(listResponseDTO);
    }
    @PutMapping("/update-laptop/{id}")
    public ResponseEntity<ResponseDTO<LaptopDTO>> updateLaptops(@PathVariable Long id, @RequestBody LaptopDTO laptopDTO){
        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(),
                "Laptop updated Successfully !!!", laptopService.updateLaptop(id, laptopDTO)));
    }
    @GetMapping("/{id}")
    public ResponseEntity<LaptopEntity> getLaptopsById(@PathVariable Long id){
        Optional<LaptopEntity> laptop = laptopService.getLaptopById(id);
        return laptop.map(ResponseEntity::ok).orElseGet(()-> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/delete-laptop/{id}")
    public ResponseEntity<Void> deleteLaptops(@PathVariable Long id){
        laptopService.deleteLaptop(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseDTO<Page<LaptopEntity>>> searchLaptops(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String sort) {
        
        log.info("Received request to search laptops. Search: {}, Brand: {}, MinPrice: {}, MaxPrice: {}, Page: {}, Size: {}, Sort: {}",
                 search, brand, minPrice, maxPrice, page, size, sort);
        
        try {
            Page<LaptopEntity> laptops = laptopService.searchLaptops(search, brand, minPrice, maxPrice, page, size, sort);
            log.info("Successfully fetched {} laptops in page {} out of {} total elements", 
                     laptops.getNumberOfElements(), laptops.getNumber(), laptops.getTotalElements());
            return ResponseEntity.ok(new ResponseDTO<>(HttpStatus.OK.value(), "Laptops fetched successfully", laptops));
        } catch (Exception e) {
            log.error("Error occurred while searching for laptops", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ResponseDTO<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Failed to fetch laptops", null));
        }
    }
}
