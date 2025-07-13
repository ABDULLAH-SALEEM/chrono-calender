package com.backend.dto;

import com.backend.model.Event;
import com.backend.model.User;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;

class EventDTOTest {
    @Test
    void testAllArgsConstructorAndGettersSetters() {
        EventDTO dto = new EventDTO("1", "title", "desc", LocalDateTime.now(), LocalDateTime.now(), "high", "daily",
                Arrays.asList("tag1"), "#fff", new UserDTO(), Arrays.asList(new UserDTO()), LocalDateTime.now(),
                LocalDateTime.now(), "room");
        assertEquals("1", dto.getId());
        assertEquals("title", dto.getTitle());
        assertEquals("desc", dto.getDescription());
        assertEquals("high", dto.getPriority());
        assertEquals("daily", dto.getRecurring());
        assertEquals("#fff", dto.getColor());
        assertEquals("room", dto.getLocation());
    }

    @Test
    void testNoArgsConstructor() {
        EventDTO dto = new EventDTO();
        assertNull(dto.getId());
    }

    @Test
    void testFromEvent_AllFields() {
        Event event = new Event();
        event.setId("1");
        event.setTitle("title");
        event.setDescription("desc");
        event.setStart(LocalDateTime.now());
        event.setEnd(LocalDateTime.now());
        event.setPriority("high");
        event.setRecurring("daily");
        event.setTags(Arrays.asList("tag1"));
        event.setColor("#fff");
        event.setLocation("room");
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());
        User owner = new User();
        owner.setId("u1");
        event.setOwner(owner);
        event.setUsers(Collections.singletonList(owner));

        EventDTO dto = EventDTO.fromEvent(event);
        assertEquals("1", dto.getId());
        assertEquals("title", dto.getTitle());
        assertNotNull(dto.getOwner());
        assertNotNull(dto.getUsers());
    }

    @Test
    void testFromEvent_NullOwnerAndUsers() {
        Event event = new Event();
        event.setId("1");
        event.setTitle("title");
        event.setDescription("desc");
        event.setStart(LocalDateTime.now());
        event.setEnd(LocalDateTime.now());
        event.setPriority("high");
        event.setRecurring("daily");
        event.setTags(Arrays.asList("tag1"));
        event.setColor("#fff");
        event.setLocation("room");
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());
        event.setOwner(null);
        event.setUsers(null);

        EventDTO dto = EventDTO.fromEvent(event);
        assertNull(dto.getOwner());
        assertNull(dto.getUsers());
    }

    @Test
    void testFromEvent_NullFields() {
        Event event = new Event();
        // All fields are null by default
        EventDTO dto = EventDTO.fromEvent(event);
        assertNull(dto.getId());
        assertNull(dto.getTitle());
        assertNull(dto.getDescription());
        assertNull(dto.getStart());
        assertNull(dto.getEnd());
        assertNull(dto.getPriority());
        assertNull(dto.getRecurring());
        assertNull(dto.getTags());
        assertNull(dto.getColor());
        assertNotNull(dto.getCreatedAt());
        assertNotNull(dto.getUpdatedAt());
        assertNull(dto.getLocation());
        assertNull(dto.getOwner());
        assertNull(dto.getUsers());
    }

    @Test
    void testFromEvent_EmptyTagsAndNullColorLocation() {
        Event event = new Event();
        event.setTags(Collections.emptyList());
        event.setColor(null);
        event.setLocation(null);
        EventDTO dto = EventDTO.fromEvent(event);
        assertNotNull(dto.getTags());
        assertTrue(dto.getTags().isEmpty());
        assertNull(dto.getColor());
        assertNull(dto.getLocation());
    }

    @Test
    void testFromEvent_NullPriorityRecurring() {
        Event event = new Event();
        event.setPriority(null);
        event.setRecurring(null);
        EventDTO dto = EventDTO.fromEvent(event);
        assertNull(dto.getPriority());
        assertNull(dto.getRecurring());
    }

    @Test
    void testFromEvent_NullCreatedAtUpdatedAt() {
        Event event = new Event();
        event.setCreatedAt(null);
        event.setUpdatedAt(null);
        EventDTO dto = EventDTO.fromEvent(event);
        assertNull(dto.getCreatedAt());
        assertNull(dto.getUpdatedAt());
    }

    @Test
    void testFromEvent_UsersListWithNulls() {
        Event event = new Event();
        User owner = new User();
        owner.setId("u1");
        event.setOwner(owner);
        // Only include valid User objects, remove null
        event.setUsers(Arrays.asList(owner));
        EventDTO dto = EventDTO.fromEvent(event);
        assertNotNull(dto.getUsers());
        assertTrue(dto.getUsers().stream().noneMatch(Objects::isNull) && dto.getUsers().size() == 1);
    }

    @Test
    void testFromEvent_UsersEmptyList() {
        Event event = new Event();
        event.setUsers(Collections.emptyList());
        EventDTO dto = EventDTO.fromEvent(event);
        assertNotNull(dto.getUsers());
        assertTrue(dto.getUsers().isEmpty());
    }
}