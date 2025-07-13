package com.backend.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RegisterRequestTest {
    @Test
    void testGettersSetters() {
        RegisterRequest req = new RegisterRequest();
        req.setName("name");
        req.setEmail("email@example.com");
        req.setPassword("password");
        assertEquals("name", req.getName());
        assertEquals("email@example.com", req.getEmail());
        assertEquals("password", req.getPassword());
    }
}