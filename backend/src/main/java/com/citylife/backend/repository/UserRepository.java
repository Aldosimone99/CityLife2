package com.citylife.backend.repository;

import com.citylife.backend.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
    Users findByEmailAndPassword(String email, String password); // Add method for finding users by email and password
}