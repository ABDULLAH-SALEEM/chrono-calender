package com.backend.controller;

import com.backend.dto.CreateEventRequest;
import com.backend.dto.EventDTO;
import com.backend.dto.UpdateEventRequest;
import com.backend.service.EventService;
import com.backend.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class EventControllerTest {
    @Mock
    private EventService eventService;
    @Mock
    private JwtService jwtService;
    @InjectMocks
    private EventController eventController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateEvent_Success() {
        CreateEventRequest request = new CreateEventRequest();
        request.setTitle("Test Event");
        String token = "Bearer sometoken";
        String email = "test@example.com";
        EventDTO eventDTO = new EventDTO();
        eventDTO.setTitle("Test Event");

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        when(eventService.createEvent(request, email)).thenReturn(eventDTO);

        ResponseEntity<EventDTO> response = eventController.createEvent(request, token);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Test Event", response.getBody().getTitle());
    }

    @Test
    void testGetEvent_Success() {
        String eventId = "1";
        String token = "Bearer sometoken";
        String email = "test@example.com";
        EventDTO eventDTO = new EventDTO();
        eventDTO.setId(eventId);

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        when(eventService.getEventById(eventId, email)).thenReturn(eventDTO);

        ResponseEntity<EventDTO> response = eventController.getEvent(eventId, token);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(eventId, response.getBody().getId());
    }

    @Test
    void testGetAllEvents() {
        String token = "Bearer sometoken";
        String email = "test@example.com";
        List<EventDTO> events = Arrays.asList(new EventDTO(), new EventDTO());

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        when(eventService.getAllEvents(email)).thenReturn(events);

        ResponseEntity<List<EventDTO>> response = eventController.getAllEvents(token);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(2, response.getBody().size());
    }

    @Test
    void testGetEventsByDateRange() {
        String token = "Bearer sometoken";
        String email = "test@example.com";
        LocalDateTime start = LocalDateTime.now();
        LocalDateTime end = start.plusDays(1);
        List<EventDTO> events = Collections.singletonList(new EventDTO());

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        when(eventService.getEventsByDateRange(email, start, end)).thenReturn(events);

        ResponseEntity<List<EventDTO>> response = eventController.getEventsByDateRange(start, end, token);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testUpdateEvent() {
        String eventId = "1";
        UpdateEventRequest request = new UpdateEventRequest();
        String token = "Bearer sometoken";
        String email = "test@example.com";
        EventDTO eventDTO = new EventDTO();
        eventDTO.setId(eventId);

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        when(eventService.updateEvent(eventId, request, email)).thenReturn(eventDTO);

        ResponseEntity<EventDTO> response = eventController.updateEvent(eventId, request, token);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(eventId, response.getBody().getId());
    }

    @Test
    void testDeleteEvent() {
        String eventId = "1";
        String token = "Bearer sometoken";
        String email = "test@example.com";

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        doNothing().when(eventService).deleteEvent(eventId, email);

        ResponseEntity<Void> response = eventController.deleteEvent(eventId, token);
        assertEquals(204, response.getStatusCodeValue());
    }

    @Test
    void testJoinEvent() {
        String eventId = "1";
        String token = "Bearer sometoken";
        String email = "test@example.com";
        EventDTO eventDTO = new EventDTO();
        eventDTO.setId(eventId);

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        when(eventService.joinEvent(eventId, email)).thenReturn(eventDTO);

        ResponseEntity<EventDTO> response = eventController.joinEvent(eventId, token);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(eventId, response.getBody().getId());
    }

    @Test
    void testLeaveEvent() {
        String eventId = "1";
        String token = "Bearer sometoken";
        String email = "test@example.com";
        EventDTO eventDTO = new EventDTO();
        eventDTO.setId(eventId);

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        when(eventService.leaveEvent(eventId, email)).thenReturn(eventDTO);

        ResponseEntity<EventDTO> response = eventController.leaveEvent(eventId, token);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(eventId, response.getBody().getId());
    }

    @Test
    void testGetEventsByPriority() {
        String token = "Bearer sometoken";
        String email = "test@example.com";
        String priority = "high";
        List<EventDTO> events = Collections.singletonList(new EventDTO());

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        when(eventService.getEventsByPriority(email, priority)).thenReturn(events);

        ResponseEntity<List<EventDTO>> response = eventController.getEventsByPriority(priority, token);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testGetEventsByTag() {
        String token = "Bearer sometoken";
        String email = "test@example.com";
        String tag = "work";
        List<EventDTO> events = Collections.singletonList(new EventDTO());

        when(jwtService.extractUsername("sometoken")).thenReturn(email);
        when(eventService.getEventsByTag(email, tag)).thenReturn(events);

        ResponseEntity<List<EventDTO>> response = eventController.getEventsByTag(tag, token);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
    }
}