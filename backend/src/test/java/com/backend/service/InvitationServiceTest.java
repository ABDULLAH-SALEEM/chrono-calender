package com.backend.service;

import com.backend.dto.InvitationDTO;
import com.backend.model.Event;
import com.backend.model.Invitation;
import com.backend.model.User;
import com.backend.repository.EventRepository;
import com.backend.repository.InvitationRepository;
import com.backend.repository.UserRepository;
import com.backend.exception.EventException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class InvitationServiceTest {
    @Mock
    private InvitationRepository invitationRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private InvitationService invitationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateInvitations_UserNotFound() {
        when(eventRepository.findById(anyString())).thenReturn(Optional.of(new Event()));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        assertThrows(EventException.class,
                () -> invitationService.createInvitations("e1", Arrays.asList("u1"), "owner@example.com"));
    }

    @Test
    void testGetInvitationsForUser_UserNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        assertThrows(EventException.class, () -> invitationService.getInvitationsForUser("user@example.com"));
    }

    @Test
    void testAcceptInvitation_InvitationNotFound() {
        when(invitationRepository.findById(anyString())).thenReturn(Optional.empty());
        assertThrows(EventException.class, () -> invitationService.acceptInvitation("inv1", "user@example.com"));
    }

    @Test
    void testDeclineInvitation_InvitationNotFound() {
        when(invitationRepository.findById(anyString())).thenReturn(Optional.empty());
        assertThrows(EventException.class, () -> invitationService.declineInvitation("inv1", "user@example.com"));
    }

    @Test
    void testDeleteInvitationsForEvent() {
        doNothing().when(invitationRepository).deleteByEventId("e1");
        assertDoesNotThrow(() -> invitationService.deleteInvitationsForEvent("e1"));
    }

    @Test
    void testCreateInvitations_SkipOwnerAndAlreadyInvitedAndAlreadyInEvent() {
        String eventId = "e1";
        String ownerEmail = "owner@example.com";
        User owner = new User();
        owner.setId("1");
        Event event = new Event();
        event.setOwner(owner);
        event.setUsers(new ArrayList<>(Collections.singletonList(owner)));
        User invitedUser = new User();
        invitedUser.setId("2");
        Invitation existingInvitation = new Invitation();
        // Simulate already invited
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(ownerEmail)).thenReturn(Optional.of(owner));
        when(userRepository.findById("1")).thenReturn(Optional.of(owner));
        when(userRepository.findById("2")).thenReturn(Optional.of(invitedUser));
        when(invitationRepository.findByEventIdAndInvitedUserId(eventId, "2"))
                .thenReturn(Optional.of(existingInvitation));
        // Should skip owner and already invited
        invitationService.createInvitations(eventId, Arrays.asList("1", "2"), ownerEmail);
        verify(invitationRepository, never()).save(any());
    }

    @Test
    void testCreateInvitations_UserAlreadyInEvent() {
        String eventId = "e1";
        String ownerEmail = "owner@example.com";
        User owner = new User();
        owner.setId("1");
        User invitedUser = new User();
        invitedUser.setId("2");
        Event event = new Event();
        event.setOwner(owner);
        event.setUsers(new ArrayList<>(Arrays.asList(owner, invitedUser)));
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(ownerEmail)).thenReturn(Optional.of(owner));
        when(userRepository.findById("2")).thenReturn(Optional.of(invitedUser));
        when(invitationRepository.findByEventIdAndInvitedUserId(eventId, "2")).thenReturn(Optional.empty());
        // Should skip already in event
        invitationService.createInvitations(eventId, Arrays.asList("2"), ownerEmail);
        verify(invitationRepository, never()).save(any());
    }

    @Test
    void testGetInvitationsForUser_Success() {
        String userEmail = "user@example.com";
        User user = new User();
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(invitationRepository.findByInvitedUser(user)).thenReturn(Collections.emptyList());
        List<InvitationDTO> result = invitationService.getInvitationsForUser(userEmail);
        assertNotNull(result);
    }

    @Test
    void testAcceptInvitation_AccessDenied() {
        String invitationId = "inv1";
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("2");
        User invitedUser = new User();
        invitedUser.setId("3");
        Invitation invitation = new Invitation();
        invitation.setInvitedUser(invitedUser);
        when(invitationRepository.findById(invitationId)).thenReturn(Optional.of(invitation));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        assertThrows(EventException.class, () -> invitationService.acceptInvitation(invitationId, userEmail));
    }

    @Test
    void testAcceptInvitation_AlreadyInEvent() {
        String invitationId = "inv1";
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("2");
        Invitation invitation = new Invitation();
        invitation.setInvitedUser(user);
        Event event = new Event();
        event.setUsers(new ArrayList<>(Collections.singletonList(user)));
        invitation.setEvent(event);
        when(invitationRepository.findById(invitationId)).thenReturn(Optional.of(invitation));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        // Should not add user again
        assertDoesNotThrow(() -> invitationService.acceptInvitation(invitationId, userEmail));
    }

    @Test
    void testDeclineInvitation_AccessDenied() {
        String invitationId = "inv1";
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("2");
        User invitedUser = new User();
        invitedUser.setId("3");
        Invitation invitation = new Invitation();
        invitation.setInvitedUser(invitedUser);
        when(invitationRepository.findById(invitationId)).thenReturn(Optional.of(invitation));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        assertThrows(EventException.class, () -> invitationService.declineInvitation(invitationId, userEmail));
    }

    @Test
    void testCreateInvitations_HappyPath() {
        String eventId = "e1";
        String ownerEmail = "owner@example.com";
        User owner = new User();
        owner.setId("1");
        User invitedUser = new User();
        invitedUser.setId("2");
        Event event = new Event();
        event.setOwner(owner);
        event.setUsers(new ArrayList<>(Collections.singletonList(owner)));
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(ownerEmail)).thenReturn(Optional.of(owner));
        when(userRepository.findById("2")).thenReturn(Optional.of(invitedUser));
        when(invitationRepository.findByEventIdAndInvitedUserId(eventId, "2")).thenReturn(Optional.empty());
        // Should create and save invitation
        invitationService.createInvitations(eventId, Arrays.asList("2"), ownerEmail);
        verify(invitationRepository).save(any(Invitation.class));
    }

    @Test
    void testCreateInvitations_UserInLoopNotFound() {
        String eventId = "e1";
        String ownerEmail = "owner@example.com";
        User owner = new User();
        owner.setId("1");
        Event event = new Event();
        event.setOwner(owner);
        event.setUsers(new ArrayList<>(Collections.singletonList(owner)));
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(ownerEmail)).thenReturn(Optional.of(owner));
        when(userRepository.findById("2")).thenReturn(Optional.empty());
        assertThrows(EventException.class,
                () -> invitationService.createInvitations(eventId, Arrays.asList("2"), ownerEmail));
    }

    @Test
    void testAcceptInvitation_AddUserToEventAndDeleteInvitation() {
        String invitationId = "inv1";
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("2");
        Invitation invitation = new Invitation();
        invitation.setInvitedUser(user);
        Event event = new Event();
        event.setUsers(new ArrayList<>());
        invitation.setEvent(event);
        when(invitationRepository.findById(invitationId)).thenReturn(Optional.of(invitation));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        doNothing().when(invitationRepository).delete(invitation);
        invitationService.acceptInvitation(invitationId, userEmail);
        assertTrue(event.getUsers().contains(user));
        verify(invitationRepository).delete(invitation);
    }

    @Test
    void testDeclineInvitation_DeletesInvitation() {
        String invitationId = "inv1";
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("2");
        Invitation invitation = new Invitation();
        invitation.setInvitedUser(user);
        when(invitationRepository.findById(invitationId)).thenReturn(Optional.of(invitation));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        doNothing().when(invitationRepository).delete(invitation);
        invitationService.declineInvitation(invitationId, userEmail);
        verify(invitationRepository).delete(invitation);
    }

    @Test
    void testGetInvitationsForUser_EmptyList() {
        String userEmail = "user@example.com";
        User user = new User();
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(invitationRepository.findByInvitedUser(user)).thenReturn(Collections.emptyList());
        List<InvitationDTO> result = invitationService.getInvitationsForUser(userEmail);
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}