package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.LaptopDTO;
import laptop_store.olsbackend.entity.LaptopEntity;

import java.util.List;
import java.util.Optional;

public interface LaptopService {
    Long createLaptop(LaptopDTO laptopDTO);
    List<LaptopEntity> getAllLaptops();
    LaptopDTO updateLaptop(Long id, LaptopDTO laptopDTO);
    Optional<LaptopEntity> getLaptopById(Long id);

}
