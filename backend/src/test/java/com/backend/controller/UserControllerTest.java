package com.backend.controller;

import com.backend.dto.UserDTO;
import com.backend.model.User;
import com.backend.repository.UserRepository;
import com.backend.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class UserControllerTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private JwtService jwtService;
    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllUsers_Success() {
        String token = "Bearer sometoken";
        String email = "test@example.com";
        User currentUser = new User();
        currentUser.setId("1");
        currentUser.setEmail(email);

        User user2 = new User();
        user2.setId("2");
        user2.setEmail("user2@example.com");

        User user3 = new User();
        user3.setId("3");
        user3.setEmail("user3@example.com");

        List<User> allUsers = Arrays.asList(currentUser, user2, user3);

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(currentUser));
        when(userRepository.findAll()).thenReturn(allUsers);

        ResponseEntity<List<UserDTO>> response = userController.getAllUsers(token);
        assertEquals(200, response.getStatusCodeValue());
        List<UserDTO> users = response.getBody();
        assertEquals(2, users.size());
        assertTrue(users.stream().noneMatch(u -> u.getEmail().equals(email)));
    }

    @Test
    void testGetAllUsers_UserNotFound() {
        String token = "Bearer sometoken";
        String email = "test@example.com";
        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> userController.getAllUsers(token));
    }
}