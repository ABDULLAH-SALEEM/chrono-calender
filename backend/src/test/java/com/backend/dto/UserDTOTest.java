package com.backend.dto;

import com.backend.model.User;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class UserDTOTest {
    @Test
    void testAllArgsConstructorAndGettersSetters() {
        UserDTO dto = new UserDTO("1", "name", "email", LocalDateTime.now(), "Europe/Berlin");
        assertEquals("1", dto.getId());
        assertEquals("name", dto.getName());
        assertEquals("email", dto.getEmail());
        assertEquals("Europe/Berlin", dto.getTimezone());
    }

    @Test
    void testNoArgsConstructor() {
        UserDTO dto = new UserDTO();
        assertNull(dto.getId());
    }

    @Test
    void testFromUser() {
        User user = new User();
        user.setId("1");
        user.setName("name");
        user.setEmail("email");
        user.setCreatedAt(LocalDateTime.now());
        user.setTimezone("Europe/Berlin");
        UserDTO dto = UserDTO.fromUser(user);
        assertEquals("1", dto.getId());
        assertEquals("name", dto.getName());
        assertEquals("email", dto.getEmail());
        assertEquals("Europe/Berlin", dto.getTimezone());
    }

    @Test
    void testFromUser_NullCreatedAt() {
        User user = new User();
        user.setId("1");
        user.setName("name");
        user.setEmail("email");
        user.setCreatedAt(null);
        user.setTimezone("Europe/Berlin");
        UserDTO dto = UserDTO.fromUser(user);
        assertNull(dto.getCreatedAt());
    }
}