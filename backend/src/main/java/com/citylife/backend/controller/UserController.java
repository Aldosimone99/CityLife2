package com.citylife.backend.controller;

import com.citylife.backend.model.Users;
import com.citylife.backend.repository.UserRepository;
import com.citylife.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
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
    public ResponseEntity<Users> registerUser(@RequestBody Users user) {
        Users savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PostMapping("/login")
    public ResponseEntity<Users> loginUser(@RequestBody Users user) {
        Users foundUser = userRepository.findByUsernameAndPassword(user.getUsername(), user.getPassword());
        if (foundUser != null) {
            return ResponseEntity.ok(foundUser);
        } else {
            return ResponseEntity.status(401).build();
        }
    }
}