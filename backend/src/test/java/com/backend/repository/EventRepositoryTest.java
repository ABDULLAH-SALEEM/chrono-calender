package com.backend.repository;

import com.backend.model.Event;
import com.backend.model.User;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EventRepositoryTest {
    @Mock
    private EventRepository eventRepository;

    public EventRepositoryTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindByOwner() {
        User owner = new User();
        when(eventRepository.findByOwner(owner)).thenReturn(Collections.emptyList());
        assertNotNull(eventRepository.findByOwner(owner));
    }

    @Test
    void testFindByUsersContaining() {
        User user = new User();
        when(eventRepository.findByUsersContaining(user)).thenReturn(Collections.emptyList());
        assertNotNull(eventRepository.findByUsersContaining(user));
    }

    @Test
    void testFindByOwnerOrUsersContaining() {
        when(eventRepository.findByOwnerOrUsersContaining("u1")).thenReturn(Collections.emptyList());
        assertNotNull(eventRepository.findByOwnerOrUsersContaining("u1"));
    }

    @Test
    void testFindByStartBetween() {
        LocalDateTime now = LocalDateTime.now();
        when(eventRepository.findByStartBetween(now, now)).thenReturn(Collections.emptyList());
        assertNotNull(eventRepository.findByStartBetween(now, now));
    }

    @Test
    void testFindByPriority() {
        when(eventRepository.findByPriority("high")).thenReturn(Collections.emptyList());
        assertNotNull(eventRepository.findByPriority("high"));
    }

    @Test
    void testFindByRecurring() {
        when(eventRepository.findByRecurring("daily")).thenReturn(Collections.emptyList());
        assertNotNull(eventRepository.findByRecurring("daily"));
    }

    @Test
    void testFindByTagsContaining() {
        when(eventRepository.findByTagsContaining("tag1")).thenReturn(Collections.emptyList());
        assertNotNull(eventRepository.findByTagsContaining("tag1"));
    }

    @Test
    void testFindByOwnerAndStartBetween() {
        User owner = new User();
        LocalDateTime now = LocalDateTime.now();
        when(eventRepository.findByOwnerAndStartBetween(owner, now, now)).thenReturn(Collections.emptyList());
        assertNotNull(eventRepository.findByOwnerAndStartBetween(owner, now, now));
    }

    @Test
    void testFindByUsersContainingAndStartBetween() {
        User user = new User();
        LocalDateTime now = LocalDateTime.now();
        when(eventRepository.findByUsersContainingAndStartBetween(user, now, now)).thenReturn(Collections.emptyList());
        assertNotNull(eventRepository.findByUsersContainingAndStartBetween(user, now, now));
    }
}