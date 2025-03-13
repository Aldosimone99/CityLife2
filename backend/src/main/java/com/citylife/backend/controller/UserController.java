package com.citylife.backend.controller;

import com.citylife.backend.model.Users;
import com.citylife.backend.model.LoginRequest;
import com.citylife.backend.repository.UserRepository;
import com.citylife.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")  // Permette richieste da Angular
public class UserController {
    private final UserService userService;

    @Autowired
    private UserRepository userRepository;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<Users> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Optional<Users> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public ResponseEntity<?> registerUser(@RequestBody Users user) {
        userService.saveUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/check")
    public ResponseEntity<?> checkEmailAndUsername(@RequestBody Users user) {
        boolean isAvailable = userService.isEmailOrUsernameAvailable(user.getEmail(), user.getUsername());
        return ResponseEntity.ok(Map.of("isAvailable", isAvailable));
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Users user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(Map.of("id", user.getId()));
    }
}