package com.citylife.backend.controller;

import com.citylife.backend.interfaces.requestes.LoginRequest;
import com.citylife.backend.model.Post;
import com.citylife.backend.model.User;
import com.citylife.backend.service.UserService;
import com.citylife.backend.util.JwtUtil; // Import JwtUtil
import com.citylife.backend.service.PostService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")  // Permette richieste da Angular
public class UserController {
    private final UserService userService;
    private final PostService postService;
    private final JwtUtil jwtUtil; // Add JwtUtil field
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    public UserController(UserService userService, PostService postService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.postService = postService; // Inietta PostService
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getLoggedUserDetails(@RequestHeader("Authorization") String token) {
        try {
            // Rimuovi il prefisso "Bearer " dal token
            String jwt = token.replace("Bearer ", "");
            // Estrai l'email dal token
            String email = jwtUtil.extractUsername(jwt);
            // Recupera i dettagli dell'utente dal database
            Optional<User> user = userService.getUserByEmail(email);
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            logger.error("Error retrieving user details: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving user details");
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateLoggedUserDetails(
        @RequestHeader("Authorization") String token,
        @RequestBody User updatedUserDetails
    ) {
        try {
            String jwt = token.replace("Bearer ", "");
            String email = jwtUtil.extractUsername(jwt);

            Optional<User> userOptional = userService.getUserByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();

                if (updatedUserDetails.getFirstName() != null) {
                    user.setFirstName(updatedUserDetails.getFirstName());
                }
                if (updatedUserDetails.getLastName() != null) {
                    user.setLastName(updatedUserDetails.getLastName());
                }
                if (updatedUserDetails.getEmail() != null) {
                    user.setEmail(updatedUserDetails.getEmail());
                }
                if (updatedUserDetails.getUsername() != null) {
                    user.setUsername(updatedUserDetails.getUsername());
                }
                if (updatedUserDetails.getPassword() != null) {
                    user.setPassword(updatedUserDetails.getPassword());
                }
                if (updatedUserDetails.getGender() != null) {
                    user.setGender(updatedUserDetails.getGender());
                }
                if (updatedUserDetails.getAge() != null) {
                    user.setAge(updatedUserDetails.getAge());
                }

                User savedUser = userService.saveUser(user);
                logger.info("Updated user: {}", savedUser);

                return ResponseEntity.ok(Map.of("message", "User details updated successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            logger.error("Error updating user details: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating user details");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(
        @PathVariable Long id,
        @RequestHeader("Authorization") String token
    ) {
        try {
            // Rimuovi il prefisso "Bearer " dal token
            String jwt = token.replace("Bearer ", "");
            // Verifica il token e ottieni l'email
            String email = jwtUtil.extractUsername(jwt);

            // Controlla se l'utente esiste
            Optional<User> user = userService.getUserById(id);
            if (user.isPresent()) {
                return ResponseEntity.ok(user.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            logger.error("Error retrieving user by ID: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or missing token");
        }
    }

    @GetMapping("/{id}/posts")
    public ResponseEntity<?> getUserPosts(
        @PathVariable Long id,
        @RequestHeader("Authorization") String token
    ) {
        try {
            // Rimuovi il prefisso "Bearer " dal token
            String jwt = token.replace("Bearer ", "");
            // Verifica il token e ottieni l'email
            String email = jwtUtil.extractUsername(jwt);

            // Controlla se l'utente esiste
            Optional<User> user = userService.getUserById(id);
            if (user.isPresent()) {
                // Recupera i post dell'utente
                List<Post> posts = postService.getPostsByUserId(id);
                return ResponseEntity.ok(posts);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }
        } catch (Exception e) {
            logger.error("Error retrieving posts for user ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid or missing token");
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
        userService.saveUser(user);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/check")
    public ResponseEntity<?> checkEmailAndUsername(@RequestBody User user) {
        boolean isAvailable = userService.isEmailOrUsernameAvailable(user.getEmail(), user.getUsername());
        return ResponseEntity.ok(Map.of("isAvailable", isAvailable));
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        logger.info("Login request received for email: {}", loginRequest.getEmail());
        try {
            User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(Map.of("token", token, "id", user.getId()));
        } catch (Exception e) {
            logger.error("Error during login: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed");
        }
    }
}