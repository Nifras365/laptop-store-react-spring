package laptop_store.olsbackend.repository;

import laptop_store.olsbackend.entity.LaptopEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface LaptopRepository extends JpaRepository<LaptopEntity, Long>, JpaSpecificationExecutor<LaptopEntity> {
}
