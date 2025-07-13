package com.backend.model;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

class EventTest {
    @Test
    void testAllArgsConstructorAndGettersSetters() {
        User owner = new User();
        Event event = new Event("1", "title", "desc", LocalDateTime.now(), LocalDateTime.now(), "high", "daily",
                Arrays.asList("tag1"), "#fff", "room", owner, Collections.singletonList(owner), LocalDateTime.now(),
                LocalDateTime.now());
        assertEquals("1", event.getId());
        assertEquals("title", event.getTitle());
        assertEquals("desc", event.getDescription());
        assertEquals("high", event.getPriority());
        assertEquals("daily", event.getRecurring());
        assertEquals("#fff", event.getColor());
        assertEquals("room", event.getLocation());
        assertNotNull(event.getOwner());
        assertNotNull(event.getUsers());
    }

    @Test
    void testNoArgsConstructor() {
        Event event = new Event();
        assertNull(event.getId());
    }

    @Test
    void testEquals_Self() {
        Event event = new Event();
        assertTrue(event.equals(event));
    }

    @Test
    void testEquals_Null() {
        Event event = new Event();
        assertFalse(event.equals(null));
    }

    @Test
    void testEquals_DifferentClass() {
        Event event = new Event();
        assertFalse(event.equals("not an event"));
    }

    @Test
    void testEquals_DifferentId() {
        Event event1 = new Event();
        event1.setId("1");
        Event event2 = new Event();
        event2.setId("2");
        assertFalse(event1.equals(event2));
    }

    @Test
    void testEquals_SameId() {
        Event event1 = new Event();
        event1.setId("1");
        Event event2 = new Event();
        event2.setId("1");
        assertTrue(event1.equals(event2));
    }

    @Test
    void testEquals_OneIdNull() {
        Event event1 = new Event();
        event1.setId(null);
        Event event2 = new Event();
        event2.setId("1");
        assertFalse(event1.equals(event2));
        assertFalse(event2.equals(event1));
    }

    @Test
    void testEquals_BothIdNull() {
        Event event1 = new Event();
        event1.setId(null);
        Event event2 = new Event();
        event2.setId(null);
        assertFalse(event1.equals(event2));
    }

    @Test
    void testHashCode_IdNull() {
        Event event = new Event();
        event.setId(null);
        assertEquals(0, event.hashCode());
    }

    @Test
    void testHashCode_IdNotNull() {
        Event event = new Event();
        event.setId("abc");
        assertEquals("abc".hashCode(), event.hashCode());
    }

    @Test
    void testHashCode_ConsistencyWithEquals() {
        Event event1 = new Event();
        event1.setId("1");
        Event event2 = new Event();
        event2.setId("1");
        assertEquals(event1, event2);
        assertEquals(event1.hashCode(), event2.hashCode());
    }
}