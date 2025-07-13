package com.backend.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {
    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void testHandleRuntimeException() {
        RuntimeException ex = new RuntimeException("runtime error");
        ResponseEntity<Map<String, String>> response = handler.handleRuntimeException(ex);
        assertEquals(400, response.getStatusCodeValue());
        assertEquals("runtime error", response.getBody().get("error"));
    }

    @Test
    void testHandleEventException() {
        EventException ex = new EventException("event error");
        ResponseEntity<Map<String, String>> response = handler.handleEventException(ex);
        assertEquals(400, response.getStatusCodeValue());
        assertEquals("event error", response.getBody().get("error"));
    }

    @Test
    void testHandleGenericException() {
        Exception ex = new Exception("something went wrong");
        ResponseEntity<Map<String, String>> response = handler.handleGenericException(ex);
        assertEquals(500, response.getStatusCodeValue());
        assertEquals("An unexpected error occurred", response.getBody().get("error"));
    }
}