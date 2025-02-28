package laptop_store.olsbackend.repository;

import laptop_store.olsbackend.entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsersRepository extends JpaRepository<UsersEntity, Long> {
    Optional<UsersEntity> findByEmail(String email);
    Optional<UsersEntity> findByRole(String role);
    Optional<UsersEntity> findByUserId(Long userId);
}
