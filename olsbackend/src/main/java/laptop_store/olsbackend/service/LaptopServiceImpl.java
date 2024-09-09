package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.LaptopDTO;
import laptop_store.olsbackend.entity.LaptopEntity;
import laptop_store.olsbackend.exceptions.ItemNotFoundException;
import laptop_store.olsbackend.mapper.LaptopMapper;
import laptop_store.olsbackend.repository.LaptopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    @Override
    public LaptopDTO updateLaptop(Long id, LaptopDTO laptopDTO){
        Optional<LaptopEntity> laptop = laptopRepository.findById(id);

        if(laptop.isPresent()){
            LaptopEntity laptopEntity = laptopRepository.findById(id).orElseThrow();

            laptopEntity.setImage(laptopDTO.getImage());
            laptopEntity.setPrice(laptopDTO.getPrice());
            laptopEntity.setBrand(laptopDTO.getBrand());
            laptopEntity.setModel(laptopDTO.getModel());
            laptopEntity.setSpecifications(laptopDTO.getSpecifications());
            laptopEntity.setStockQuantity(laptopDTO.getStockQuantity());

            return laptopMapper.mapToDto(laptopRepository.save(laptopEntity));
        }
        else {
            throw new ItemNotFoundException("Laptop Doesn't exist with !!!");
        }
    }
    @Override
    public Optional<LaptopEntity> getLaptopById(Long id){
        return laptopRepository.findById(id);
    }
    @Override
    public void deleteLaptop(Long id){
        laptopRepository.deleteById(id);
    }
}
