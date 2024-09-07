package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.LaptopDTO;
import laptop_store.olsbackend.entity.LaptopEntity;

import java.util.List;

public interface LaptopService {
    Long createLaptop(LaptopDTO laptopDTO);
    List<LaptopEntity> getAllLaptops();
}
