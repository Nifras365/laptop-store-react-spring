package laptop_store.olsbackend.service;

import laptop_store.olsbackend.mapper.LaptopMapper;
import laptop_store.olsbackend.repository.LaptopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LaptopServiceImpl implements LaptopService{
    @Autowired
    private LaptopRepository laptopRepository;
    @Autowired
    private LaptopMapper laptopMapper;

}
