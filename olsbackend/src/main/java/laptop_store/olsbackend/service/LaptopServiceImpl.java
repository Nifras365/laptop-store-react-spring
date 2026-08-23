package laptop_store.olsbackend.service;

import laptop_store.olsbackend.dto.LaptopDTO;
import laptop_store.olsbackend.entity.LaptopEntity;
import laptop_store.olsbackend.exceptions.ItemNotFoundException;
import laptop_store.olsbackend.mapper.LaptopMapper;
import laptop_store.olsbackend.repository.LaptopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class LaptopServiceImpl implements LaptopService{
    @Autowired
    private LaptopRepository laptopRepository;
    @Autowired
    private LaptopMapper laptopMapper;
    @Override
    public Long createLaptop(LaptopDTO laptopDTO){
        log.info("Creating new laptop with model: {}", laptopDTO.getModel());
        Long id = laptopRepository.save(LaptopEntity.builder()
                .image(laptopDTO.getImage())
                .price(laptopDTO.getPrice())
                .brand(laptopDTO.getBrand())
                .model(laptopDTO.getModel())
                .specifications(laptopDTO.getSpecifications())
                .processor(laptopDTO.getProcessor())
                .stockQuantity(laptopDTO.getStockQuantity()).build()).getId();
        log.info("Successfully created laptop with ID: {}", id);
        return id;
    }
    @Override
    public List<LaptopEntity> getAllLaptops(){
        return laptopRepository.findAll();
    }

    @Override
    public LaptopDTO updateLaptop(Long id, LaptopDTO laptopDTO){
        log.info("Updating laptop with ID: {}", id);
        Optional<LaptopEntity> laptop = laptopRepository.findById(id);

        if(laptop.isPresent()){
            LaptopEntity laptopEntity = laptop.get();

            laptopEntity.setImage(laptopDTO.getImage());
            laptopEntity.setPrice(laptopDTO.getPrice());
            laptopEntity.setBrand(laptopDTO.getBrand());
            laptopEntity.setModel(laptopDTO.getModel());
            laptopEntity.setSpecifications(laptopDTO.getSpecifications());
            laptopEntity.setProcessor(laptopDTO.getProcessor());
            laptopEntity.setStockQuantity(laptopDTO.getStockQuantity());

            LaptopDTO updated = laptopMapper.mapToDto(laptopRepository.save(laptopEntity));
            log.info("Successfully updated laptop with ID: {}", id);
            return updated;
        }
        else {
            log.error("Attempted to update non-existent laptop with ID: {}", id);
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

    @Override
    public Page<LaptopEntity> searchLaptops(String search, String brand, Integer minPrice, Integer maxPrice, int page, int size, String sort) {
        Pageable pageable;
        if (sort != null && !sort.isEmpty()) {
            String[] sortParams = sort.split(",");
            Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            pageable = PageRequest.of(page, size, Sort.by(direction, sortParams[0]));
        } else {
            pageable = PageRequest.of(page, size);
        }

        Specification<LaptopEntity> spec = Specification.where(null);

        if (search != null && !search.isEmpty()) {
            String likePattern = "%" + search.toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> 
                cb.or(
                    cb.like(cb.lower(root.get("brand")), likePattern),
                    cb.like(cb.lower(root.get("model")), likePattern),
                    cb.like(cb.lower(root.get("processor")), likePattern)
                )
            );
        }

        if (brand != null && !brand.isEmpty() && !brand.equalsIgnoreCase("all")) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("brand"), brand));
        }

        if (minPrice != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        }

        if (maxPrice != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }

        log.info("Executing searchLaptops with parameters: search={}, brand={}, minPrice={}, maxPrice={}, page={}, size={}, sort={}", 
                 search, brand, minPrice, maxPrice, page, size, sort);
                 
        Page<LaptopEntity> result = laptopRepository.findAll(spec, pageable);
        log.info("Found {} laptops matching search criteria.", result.getTotalElements());
        
        return result;
    }
}
