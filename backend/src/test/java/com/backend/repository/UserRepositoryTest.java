package com.backend.repository;

import com.backend.model.User;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserRepositoryTest {
    @Mock
    private UserRepository userRepository;

    public UserRepositoryTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindByEmail() {
        when(userRepository.findByEmail("email")).thenReturn(Optional.empty());
        assertTrue(userRepository.findByEmail("email").isEmpty());
    }

    @Test
    void testExistsByEmail() {
        when(userRepository.existsByEmail("email")).thenReturn(false);
        assertFalse(userRepository.existsByEmail("email"));
    }
}