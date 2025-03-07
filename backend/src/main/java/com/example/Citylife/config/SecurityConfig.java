package com.example.citylife.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // ✅ Disabilitiamo CSRF
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll() // ✅ Permettiamo tutto su /auth/
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // ❌ No sessioni
            .httpBasic(httpBasic -> httpBasic.disable()) // ❌ Disabilitiamo HTTP Basic
            .formLogin(form -> form.disable()); // ❌ Disabilitiamo il login con form

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}