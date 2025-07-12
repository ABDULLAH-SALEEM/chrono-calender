package com.backend.controller;

import com.backend.dto.CreateEventRequest;
import com.backend.dto.EventDTO;
import com.backend.dto.UpdateEventRequest;
import com.backend.service.EventService;
import com.backend.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {
    private static final Logger logger = LoggerFactory.getLogger(EventController.class);

    @Autowired
    private EventService eventService;

    @Autowired
    private JwtService jwtService;

    @PostMapping
    public ResponseEntity<EventDTO> createEvent(
            @Valid @RequestBody CreateEventRequest request,
            @RequestHeader("Authorization") String token) {
        logger.info("Creating new event: {}", request.getTitle());

        String email = jwtService.extractUsername(token.substring(7));
        EventDTO createdEvent = eventService.createEvent(request, email);

        return ResponseEntity.ok(createdEvent);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventDTO> getEvent(
            @PathVariable String eventId,
            @RequestHeader("Authorization") String token) {
        logger.info("Getting event: {}", eventId);

        String email = jwtService.extractUsername(token.substring(7));
        EventDTO event = eventService.getEventById(eventId, email);

        return ResponseEntity.ok(event);
    }

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents(
            @RequestHeader("Authorization") String token) {
        logger.info("Getting all events");

        String email = jwtService.extractUsername(token.substring(7));
        logger.info("Extracted email from token: {}", email);

        List<EventDTO> events = eventService.getAllEvents(email);

        logger.info("Returning {} events for user: {}", events.size(), email);

        return ResponseEntity.ok(events);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<EventDTO>> getEventsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestHeader("Authorization") String token) {
        logger.info("Getting events between {} and {}", start, end);

        String email = jwtService.extractUsername(token.substring(7));
        List<EventDTO> events = eventService.getEventsByDateRange(email, start, end);

        return ResponseEntity.ok(events);
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<EventDTO> updateEvent(
            @PathVariable String eventId,
            @Valid @RequestBody UpdateEventRequest request,
            @RequestHeader("Authorization") String token) {
        logger.info("Updating event: {}", eventId);

        String email = jwtService.extractUsername(token.substring(7));
        EventDTO updatedEvent = eventService.updateEvent(eventId, request, email);

        return ResponseEntity.ok(updatedEvent);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @PathVariable String eventId,
            @RequestHeader("Authorization") String token) {
        logger.info("Deleting event: {}", eventId);

        String email = jwtService.extractUsername(token.substring(7));
        eventService.deleteEvent(eventId, email);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{eventId}/join")
    public ResponseEntity<EventDTO> joinEvent(
            @PathVariable String eventId,
            @RequestHeader("Authorization") String token) {
        logger.info("Joining event: {}", eventId);

        String email = jwtService.extractUsername(token.substring(7));
        EventDTO event = eventService.joinEvent(eventId, email);

        return ResponseEntity.ok(event);
    }

    @PostMapping("/{eventId}/leave")
    public ResponseEntity<EventDTO> leaveEvent(
            @PathVariable String eventId,
            @RequestHeader("Authorization") String token) {
        logger.info("Leaving event: {}", eventId);

        String email = jwtService.extractUsername(token.substring(7));
        EventDTO event = eventService.leaveEvent(eventId, email);

        return ResponseEntity.ok(event);
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<EventDTO>> getEventsByPriority(
            @PathVariable String priority,
            @RequestHeader("Authorization") String token) {
        logger.info("Getting events with priority: {}", priority);

        String email = jwtService.extractUsername(token.substring(7));
        List<EventDTO> events = eventService.getEventsByPriority(email, priority);

        return ResponseEntity.ok(events);
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<EventDTO>> getEventsByTag(
            @PathVariable String tag,
            @RequestHeader("Authorization") String token) {
        logger.info("Getting events with tag: {}", tag);

        String email = jwtService.extractUsername(token.substring(7));
        List<EventDTO> events = eventService.getEventsByTag(email, tag);

        return ResponseEntity.ok(events);
    }
}