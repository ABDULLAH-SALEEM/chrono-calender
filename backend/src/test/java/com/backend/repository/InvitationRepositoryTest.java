package com.backend.repository;

import com.backend.model.Invitation;
import com.backend.model.User;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Collections;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class InvitationRepositoryTest {
    @Mock
    private InvitationRepository invitationRepository;

    public InvitationRepositoryTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindByInvitedUser() {
        User user = new User();
        when(invitationRepository.findByInvitedUser(user)).thenReturn(Collections.emptyList());
        List<Invitation> result = invitationRepository.findByInvitedUser(user);
        assertNotNull(result);
    }

    @Test
    void testFindByEventIdAndInvitedUserId() {
        when(invitationRepository.findByEventIdAndInvitedUserId("e1", "u1")).thenReturn(Optional.empty());
        assertTrue(invitationRepository.findByEventIdAndInvitedUserId("e1", "u1").isEmpty());
    }

    @Test
    void testFindByEventId() {
        when(invitationRepository.findByEventId("e1")).thenReturn(Collections.emptyList());
        assertNotNull(invitationRepository.findByEventId("e1"));
    }

    @Test
    void testDeleteByEventId() {
        doNothing().when(invitationRepository).deleteByEventId("e1");
        invitationRepository.deleteByEventId("e1");
        verify(invitationRepository).deleteByEventId("e1");
    }

    @Test
    void testDeleteByEventIdAndInvitedUserId() {
        doNothing().when(invitationRepository).deleteByEventIdAndInvitedUserId("e1", "u1");
        invitationRepository.deleteByEventIdAndInvitedUserId("e1", "u1");
        verify(invitationRepository).deleteByEventIdAndInvitedUserId("e1", "u1");
    }
}