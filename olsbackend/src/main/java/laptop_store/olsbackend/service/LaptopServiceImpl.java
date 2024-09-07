package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.LaptopDTO;
import laptop_store.olsbackend.entity.LaptopEntity;
import laptop_store.olsbackend.mapper.LaptopMapper;
import laptop_store.olsbackend.repository.LaptopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LaptopServiceImpl implements LaptopService{
    @Autowired
    private LaptopRepository laptopRepository;
    @Autowired
    private LaptopMapper laptopMapper;
    @Override
    public Long createLaptop(LaptopDTO laptopDTO){
        return laptopRepository.save(LaptopEntity.builder()
                .image(laptopDTO.getImage())
                .price(laptopDTO.getPrice())
                .brand(laptopDTO.getBrand())
                .model(laptopDTO.getModel())
                .specifications(laptopDTO.getSpecifications())
                .stockQuantity(laptopDTO.getStockQuantity()).build()).getId();
    }
    @Override
    public List<LaptopEntity> getAllLaptops(){
        return laptopRepository.findAll();
    }

}
