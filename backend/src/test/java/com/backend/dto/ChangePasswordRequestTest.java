package com.backend.dto;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ChangePasswordRequestTest {
    @Test
    void testGettersSetters() {
        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("old");
        req.setNewPassword("new");
        assertEquals("old", req.getCurrentPassword());
        assertEquals("new", req.getNewPassword());
    }
}