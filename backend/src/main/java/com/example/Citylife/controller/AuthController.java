package com.example.citylife.controller;

import com.example.citylife.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController // ✅ Questo assicura che rispondiamo con JSON
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        if (userService.findByUsername(username).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Errore: Username già in uso!");
        }
        userService.registerUser(username, password);
        return ResponseEntity.ok("Registrazione avvenuta con successo!");
    }
}