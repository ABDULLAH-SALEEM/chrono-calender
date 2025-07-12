package com.backend.controller;

import com.backend.dto.LoginRequest;
import com.backend.dto.RegisterRequest;
import com.backend.dto.UserDTO;
import com.backend.dto.ChangePasswordRequest;
import com.backend.model.User;
import com.backend.service.AuthService;
import com.backend.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        logger.info("Registering new user with email: {}", request.getEmail());

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        User registeredUser = authService.register(user);
        logger.info("User registered successfully: {}", registeredUser.getEmail());

        // Create UserDetails for token generation
        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                registeredUser.getEmail(),
                registeredUser.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));

        String token = jwtService.generateToken(userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", UserDTO.fromUser(registeredUser));

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest request) {
        logger.info("Login attempt for user: {}", request.getEmail());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            logger.info("Authentication successful for user: {}", request.getEmail());

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails);

            User foundUser = authService.findByEmail(request.getEmail());
            logger.info("User found and token generated successfully");

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", UserDTO.fromUser(foundUser));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Login failed for user: {} - Error: {}", request.getEmail(), e.getMessage());
            throw e;
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(@RequestHeader("Authorization") String token) {
        String email = jwtService.extractUsername(token.substring(7));
        User user = authService.findByEmail(email);
        return ResponseEntity.ok(UserDTO.fromUser(user));
    }

    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String token,
            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            String email = jwtService.extractUsername(token.substring(7));
            authService.changePassword(email, request.getCurrentPassword(), request.getNewPassword());
            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Password change failed: {}", e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}