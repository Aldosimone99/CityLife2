package com.citylife.backend.controller;

import com.citylife.backend.model.User;
import com.citylife.backend.model.LoginRequest;
import com.citylife.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")  // Permette richieste da Angular
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
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
        User user = userService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(Map.of("id", user.getId()));
    }
}