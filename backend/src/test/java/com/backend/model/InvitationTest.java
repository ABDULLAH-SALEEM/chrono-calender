package com.backend.model;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class InvitationTest {
    @Test
    void testAllArgsConstructorAndGettersSetters() {
        Event event = new Event();
        User user = new User();
        Invitation invitation = new Invitation("1", event, user, LocalDateTime.now());
        assertEquals("1", invitation.getId());
        assertNotNull(invitation.getEvent());
        assertNotNull(invitation.getInvitedUser());
        assertNotNull(invitation.getCreatedAt());
    }

    @Test
    void testNoArgsConstructor() {
        Invitation invitation = new Invitation();
        assertNull(invitation.getId());
    }
}