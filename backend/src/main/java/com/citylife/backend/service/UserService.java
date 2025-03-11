package com.citylife.backend.service;

import com.citylife.backend.model.Users;
import com.citylife.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<Users> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Users saveUser(Users user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Users loginUser(String username, String password) {
        logger.debug("Attempting to login user with username: {}", username);
        Users foundUser = userRepository.findByUsernameAndPassword(username, password);
        if (foundUser != null) {
            logger.debug("User found: {}", foundUser.getUsername());
            return foundUser;
        } else {
            logger.debug("Invalid username or password for username: {}", username);
            throw new RuntimeException("Invalid username or password");
        }
    }
}