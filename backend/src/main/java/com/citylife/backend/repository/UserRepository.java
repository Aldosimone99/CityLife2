package com.citylife.backend.repository;

import com.citylife.backend.model.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    User findByEmailAndPassword(String email, String password);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
}