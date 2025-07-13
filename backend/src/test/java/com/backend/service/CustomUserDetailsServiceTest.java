package com.backend.service;

import com.backend.model.User;
import com.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CustomUserDetailsServiceTest {
    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private CustomUserDetailsService service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoadUserByUsername_UserFound() {
        User user = new User();
        user.setEmail("email");
        when(userRepository.findByEmail("email")).thenReturn(Optional.of(user));
        assertEquals(user, service.loadUserByUsername("email"));
    }

    @Test
    void testLoadUserByUsername_UserNotFound() {
        when(userRepository.findByEmail("email")).thenReturn(Optional.empty());
        assertThrows(UsernameNotFoundException.class, () -> service.loadUserByUsername("email"));
    }

    @Test
    void testLoadUserByUsername_NullEmail() {
        assertThrows(IllegalArgumentException.class, () -> service.loadUserByUsername(null));
    }

    @Test
    void testLoadUserByUsername_EmptyEmail() {
        assertThrows(IllegalArgumentException.class, () -> service.loadUserByUsername(" "));
    }
}