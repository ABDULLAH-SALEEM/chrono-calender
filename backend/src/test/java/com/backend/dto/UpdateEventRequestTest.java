package com.backend.dto;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;

class UpdateEventRequestTest {
    @Test
    void testAllArgsConstructorAndGettersSetters() {
        UpdateEventRequest req = new UpdateEventRequest("title", "desc", LocalDateTime.now(), LocalDateTime.now(),
                "high", "daily", Arrays.asList("tag1"), Arrays.asList("u1"), "room", "#fff");
        assertEquals("title", req.getTitle());
        assertEquals("desc", req.getDescription());
        assertEquals("high", req.getPriority());
        assertEquals("daily", req.getRecurring());
        assertEquals("room", req.getLocation());
        assertEquals("#fff", req.getColor());
        assertNotNull(req.getTags());
        assertNotNull(req.getUserIds());
    }

    @Test
    void testNoArgsConstructor() {
        UpdateEventRequest req = new UpdateEventRequest();
        assertNull(req.getTitle());
    }
}