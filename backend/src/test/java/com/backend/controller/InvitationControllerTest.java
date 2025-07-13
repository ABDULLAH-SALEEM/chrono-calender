package com.backend.controller;

import com.backend.dto.InvitationDTO;
import com.backend.service.InvitationService;
import com.backend.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class InvitationControllerTest {
    @Mock
    private InvitationService invitationService;
    @Mock
    private JwtService jwtService;
    @InjectMocks
    private InvitationController invitationController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetInvitations() {
        String token = "Bearer sometoken";
        String email = "test@example.com";
        List<InvitationDTO> invitations = Arrays.asList(new InvitationDTO(), new InvitationDTO());
        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        when(invitationService.getInvitationsForUser(email)).thenReturn(invitations);
        ResponseEntity<List<InvitationDTO>> response = invitationController.getInvitations(token);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetInvitations_CallsExtractUsernameWithCorrectToken() {
        String token = "Bearer sometoken";
        String expectedToken = "sometoken";
        String email = "test@example.com";
        List<InvitationDTO> invitations = Arrays.asList(new InvitationDTO(), new InvitationDTO());
        when(jwtService.extractUsername(expectedToken)).thenReturn(email);
        when(invitationService.getInvitationsForUser(email)).thenReturn(invitations);

        ResponseEntity<List<InvitationDTO>> response = invitationController.getInvitations(token);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
        verify(jwtService).extractUsername(expectedToken);
        verify(invitationService).getInvitationsForUser(email);
    }

    @Test
    void testAcceptInvitation() {
        String token = "Bearer sometoken";
        String email = "test@example.com";
        String invitationId = "inv1";
        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        doNothing().when(invitationService).acceptInvitation(invitationId, email);
        ResponseEntity<Void> response = invitationController.acceptInvitation(invitationId, token);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testAcceptInvitation_CallsServiceWithCorrectArgs() {
        String token = "Bearer sometoken";
        String expectedToken = "sometoken";
        String email = "test@example.com";
        String invitationId = "inv1";
        when(jwtService.extractUsername(expectedToken)).thenReturn(email);

        ResponseEntity<Void> response = invitationController.acceptInvitation(invitationId, token);

        assertEquals(200, response.getStatusCodeValue());
        verify(jwtService).extractUsername(expectedToken);
        verify(invitationService).acceptInvitation(invitationId, email);
    }

    @Test
    void testDeclineInvitation() {
        String token = "Bearer sometoken";
        String email = "test@example.com";
        String invitationId = "inv1";
        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        doNothing().when(invitationService).declineInvitation(invitationId, email);
        ResponseEntity<Void> response = invitationController.declineInvitation(invitationId, token);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    void testDeclineInvitation_CallsServiceWithCorrectArgs() {
        String token = "Bearer sometoken";
        String expectedToken = "sometoken";
        String email = "test@example.com";
        String invitationId = "inv1";
        when(jwtService.extractUsername(expectedToken)).thenReturn(email);

        ResponseEntity<Void> response = invitationController.declineInvitation(invitationId, token);

        assertEquals(200, response.getStatusCodeValue());
        verify(jwtService).extractUsername(expectedToken);
        verify(invitationService).declineInvitation(invitationId, email);
    }

    @Test
    void testGetInvitations_InvalidToken_ThrowsException() {
        String token = "Bearer"; // No space after Bearer, substring(7) will throw
        assertThrows(StringIndexOutOfBoundsException.class, () -> {
            invitationController.getInvitations(token);
        });
    }
}