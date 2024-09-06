package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.LaptopDTO;

public interface LaptopService {
    Long createLaptop(LaptopDTO laptopDTO);
}
