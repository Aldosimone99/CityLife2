package com.citylife.backend.filter;

import com.citylife.backend.service.CustomUserDetailsService;
import com.citylife.backend.util.JwtUtil;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.lang.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtRequestFilter.class);

    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    public JwtRequestFilter(CustomUserDetailsService userDetailsService, JwtUtil jwtUtil) {
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain chain)
            throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");

        logger.debug("Authorization Header: {}", authorizationHeader); // Log the Authorization header

        String email = null;
        String jwt = null;

        // Controlla se l'header contiene un token valido
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // Rimuove "Bearer " dal token
            try {
                email = jwtUtil.extractEmail(jwt); // Estrae l'email dal token
            } catch (Exception e) {
                logger.error("Error extracting email from token: {}", e.getMessage());
            }
        } else {
            logger.warn("Authorization header is missing or does not start with 'Bearer '");
        }

        // Se l'email è valida e l'utente non è già autenticato
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            var userDetails = this.userDetailsService.loadUserByUsername(email);

            // Verifica che il token sia valido per l'utente
            if (jwtUtil.validateToken(jwt, userDetails)) {
                var authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                logger.warn("Invalid JWT token for email: {}", email);
            }
        } else if (email == null) {
            logger.warn("No email extracted from token or token missing");
        }

        // Continua con il filtro successivo nella catena
        chain.doFilter(request, response);
    }
}