package com.backend.model;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import java.time.LocalDateTime;
import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {
    @Test
    void testAllArgsConstructorAndGettersSetters() {
        User user = new User("1", "name", "email", "password", LocalDateTime.now(), "Europe/Berlin");
        assertEquals("1", user.getId());
        assertEquals("name", user.getName());
        assertEquals("email", user.getEmail());
        assertEquals("password", user.getPassword());
        assertEquals("Europe/Berlin", user.getTimezone());
    }

    @Test
    void testNoArgsConstructor() {
        User user = new User();
        assertNull(user.getId());
    }

    @Test
    void testUserDetailsMethods() {
        User user = new User();
        user.setEmail("email");
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();
        assertEquals(1, authorities.size());
        assertEquals("email", user.getUsername());
        assertTrue(user.isAccountNonExpired());
        assertTrue(user.isAccountNonLocked());
        assertTrue(user.isCredentialsNonExpired());
        assertTrue(user.isEnabled());
    }
}