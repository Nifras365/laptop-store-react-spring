package laptop_store.olsbackend.controller;

import laptop_store.olsbackend.dto.LaptopDTO;
import laptop_store.olsbackend.dto.ResponseDTO;
import laptop_store.olsbackend.entity.LaptopEntity;
import laptop_store.olsbackend.service.LaptopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/laptops")
@CrossOrigin(origins = "http://localhost:3000")
public class LaptopController {
    @Autowired
    private LaptopService laptopService;
    @PostMapping("/create")
    public ResponseEntity<ResponseDTO<Long>> createLaptops(@RequestBody LaptopDTO laptopDTO){
        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(), "Laptop added successfully !!!", laptopService.createLaptop(laptopDTO)));
    }
    @GetMapping("/get-all")
    public ResponseEntity<ResponseDTO<List<LaptopEntity>>> getAll(){
        List<LaptopEntity> laptopEntities = laptopService.getAllLaptops();

        ResponseDTO<List<LaptopEntity>> listResponseDTO = new ResponseDTO<>(HttpStatus.OK.value(), "Successfully fetched all data <3", laptopEntities);

        return ResponseEntity.ok(listResponseDTO);
    }
    @PutMapping("/update-laptop/{id}")
    public ResponseEntity<ResponseDTO<LaptopDTO>> updateLaptops(@PathVariable Long id, @RequestBody LaptopDTO laptopDTO){
        return ResponseEntity.ok().body(new ResponseDTO<>(HttpStatus.OK.value(), "Laptop updated Successfully !!!", laptopService.updateLaptop(id, laptopDTO)));
    }
}
