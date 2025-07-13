package com.backend.dto;

import com.backend.model.Invitation;
import com.backend.model.Event;
import com.backend.model.User;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class InvitationDTOTest {
    @Test
    void testAllArgsConstructorAndGettersSetters() {
        InvitationDTO dto = new InvitationDTO("1", new EventDTO(), new UserDTO(), LocalDateTime.now());
        assertEquals("1", dto.getId());
        assertNotNull(dto.getEvent());
        assertNotNull(dto.getInvitedUser());
        assertNotNull(dto.getCreatedAt());
    }

    @Test
    void testNoArgsConstructor() {
        InvitationDTO dto = new InvitationDTO();
        assertNull(dto.getId());
    }

    @Test
    void testFromInvitation() {
        Invitation invitation = new Invitation();
        invitation.setId("1");
        invitation.setCreatedAt(LocalDateTime.now());
        Event event = new Event();
        User user = new User();
        invitation.setEvent(event);
        invitation.setInvitedUser(user);
        InvitationDTO dto = InvitationDTO.fromInvitation(invitation);
        assertEquals("1", dto.getId());
        assertNotNull(dto.getEvent());
        assertNotNull(dto.getInvitedUser());
        assertNotNull(dto.getCreatedAt());
    }
}