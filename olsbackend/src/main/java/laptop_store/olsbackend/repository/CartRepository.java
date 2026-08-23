package laptop_store.olsbackend.repository;

import laptop_store.olsbackend.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<CartEntity, Long> {
    List<CartEntity> findByUserID(Long userID);
    Optional<CartEntity> findByUserIDAndLaptopID(Long userID, Long laptopID);

    @Transactional
    void deleteByUserID(Long userID);
}
