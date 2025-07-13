package com.backend.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EventExceptionTest {
    @Test
    void testConstructorWithMessage() {
        EventException ex = new EventException("error message");
        assertEquals("error message", ex.getMessage());
    }

    @Test
    void testConstructorWithMessageAndCause() {
        Throwable cause = new RuntimeException("cause");
        EventException ex = new EventException("error message", cause);
        assertEquals("error message", ex.getMessage());
        assertEquals(cause, ex.getCause());
    }
}