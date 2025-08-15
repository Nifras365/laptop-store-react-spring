package laptop_store.olsbackend.repository;

import laptop_store.olsbackend.entity.OrdersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<OrdersEntity,Long> {
    List<OrdersEntity> findByUserID(Long userID);
}
