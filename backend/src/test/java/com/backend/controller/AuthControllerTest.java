package com.backend.controller;

import com.backend.dto.*;
import com.backend.model.User;
import com.backend.service.AuthService;
import com.backend.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AuthControllerTest {
    @Mock
    private AuthService authService;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private Authentication authentication;
    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegister_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setId("1");
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setCreatedAt(LocalDateTime.now());
        user.setTimezone("Europe/Berlin");

        when(authService.register(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("token");

        ResponseEntity<Map<String, Object>> response = authController.register(request);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().containsKey("token"));
        assertTrue(response.getBody().containsKey("user"));
        assertEquals("token", response.getBody().get("token"));
    }

    @Test
    void testLogin_Success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setId("1");
        user.setName("Test User");
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setCreatedAt(LocalDateTime.now());
        user.setTimezone("Europe/Berlin");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtService.generateToken(any(UserDetails.class))).thenReturn("token");
        when(authService.findByEmail(request.getEmail())).thenReturn(user);

        ResponseEntity<Map<String, Object>> response = authController.login(request);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().containsKey("token"));
        assertTrue(response.getBody().containsKey("user"));
        assertEquals("token", response.getBody().get("token"));
    }

    @Test
    void testLogin_Failure() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new RuntimeException("Bad credentials"));

        assertThrows(RuntimeException.class, () -> authController.login(request));
    }

    @Test
    void testGetCurrentUser() {
        String token = "Bearer sometoken";
        String email = "test@example.com";
        User user = new User();
        user.setId("1");
        user.setName("Test User");
        user.setEmail(email);
        user.setCreatedAt(LocalDateTime.now());
        user.setTimezone("Europe/Berlin");

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        when(authService.findByEmail(email)).thenReturn(user);

        ResponseEntity<UserDTO> response = authController.getCurrentUser(token);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(email, response.getBody().getEmail());
    }

    @Test
    void testChangePassword_Success() {
        String token = "Bearer sometoken";
        String email = "test@example.com";
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("oldpass");
        request.setNewPassword("newpass");

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        doNothing().when(authService).changePassword(email, "oldpass", "newpass");

        ResponseEntity<?> response = authController.changePassword(token, request);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(((Map<?, ?>) response.getBody()).containsKey("message"));
    }

    @Test
    void testChangePassword_Failure() {
        String token = "Bearer sometoken";
        String email = "test@example.com";
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("oldpass");
        request.setNewPassword("newpass");

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        doThrow(new RuntimeException("Current password is incorrect")).when(authService).changePassword(email,
                "oldpass", "newpass");

        ResponseEntity<?> response = authController.changePassword(token, request);
        assertEquals(400, response.getStatusCodeValue());
        assertTrue(((Map<?, ?>) response.getBody()).containsKey("message"));
    }

    @Test
    void testUpdateTimezone_Success() {
        String token = "Bearer sometoken";
        String email = "test@example.com";
        Map<String, String> request = new HashMap<>();
        request.put("timezone", "Asia/Kolkata");

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        doNothing().when(authService).updateTimezone(email, "Asia/Kolkata");

        ResponseEntity<?> response = authController.updateTimezone(token, request);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(((Map<?, ?>) response.getBody()).containsKey("message"));
    }

    @Test
    void testUpdateTimezone_Failure() {
        String token = "Bearer sometoken";
        String email = "test@example.com";
        Map<String, String> request = new HashMap<>();
        request.put("timezone", "Asia/Kolkata");

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        doThrow(new RuntimeException("User not found")).when(authService).updateTimezone(email, "Asia/Kolkata");

        ResponseEntity<?> response = authController.updateTimezone(token, request);
        assertEquals(400, response.getStatusCodeValue());
        assertTrue(((Map<?, ?>) response.getBody()).containsKey("message"));
    }
}