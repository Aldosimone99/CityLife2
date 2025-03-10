package com.citylife.backend.service;

import com.citylife.backend.model.Users;
import com.citylife.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<Users> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Users createUser(Users user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Users loginUser(Users user) {
        logger.debug("Attempting to login user with username: {}", user.getUsername());
        List<Users> foundUsers = userRepository.findByUsernameAndPassword(user.getUsername(), user.getPassword());
        if (foundUsers.size() == 1) {
            logger.debug("User found: {}", foundUsers.get(0).getUsername());
            return foundUsers.get(0);
        } else if (foundUsers.isEmpty()) {
            logger.debug("Invalid username or password for username: {}", user.getUsername());
            throw new RuntimeException("Invalid username or password");
        } else {
            logger.debug("Multiple users found with username: {}", user.getUsername());
            throw new RuntimeException("Multiple users found with the same username and password");
        }
    }
}