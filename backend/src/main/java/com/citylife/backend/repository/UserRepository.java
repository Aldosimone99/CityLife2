package com.citylife.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.citylife.backend.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}