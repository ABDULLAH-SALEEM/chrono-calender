package com.backend.controller;

import com.backend.dto.UserDTO;
import com.backend.model.User;
import com.backend.repository.UserRepository;
import com.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(
            @RequestHeader("Authorization") String token) {
        logger.info("Getting all users");

        String currentUserEmail = jwtService.extractUsername(token.substring(7));
        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<User> allUsers = userRepository.findAll();

        // Filter out the current user
        List<UserDTO> users = allUsers.stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .map(UserDTO::fromUser)
                .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }
}