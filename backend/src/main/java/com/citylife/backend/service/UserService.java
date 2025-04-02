package com.citylife.backend.service;

import com.citylife.backend.model.User;
import com.citylife.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @PersistenceContext
    private EntityManager entityManager;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional // Assicura che il metodo venga eseguito in una transazione
    public User saveUser(User user) {
        if (!entityManager.contains(user)) {
            user = entityManager.merge(user); // Sincronizza l'oggetto con il contesto di persistenza
        }
        userRepository.saveAndFlush(user); // Forza il salvataggio immediato
        return user;
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean isEmailOrUsernameAvailable(String email, String username) {
        return !userRepository.existsByEmail(email) && !userRepository.existsByUsername(username);
    }

    public User loginUser(String email, String password) {
        logger.debug("Attempting to login user with email: {}", email);
        User foundUser = userRepository.findByEmailAndPassword(email, password);
        if (foundUser != null) {
            logger.debug("User found: {}", foundUser.getEmail());
            return foundUser;
        } else {
            logger.debug("Invalid email or password for email: {}", email);
            throw new RuntimeException("Invalid email or password");
        }
    }
}