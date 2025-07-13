package com.backend.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LoginRequestTest {
    @Test
    void testGettersSetters() {
        LoginRequest req = new LoginRequest();
        req.setEmail("email@example.com");
        req.setPassword("password");
        assertEquals("email@example.com", req.getEmail());
        assertEquals("password", req.getPassword());
    }
}