package com.citylife.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.citylife.backend.model.Users;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByUsername(String username);
}