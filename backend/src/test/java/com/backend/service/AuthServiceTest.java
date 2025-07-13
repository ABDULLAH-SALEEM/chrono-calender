package com.backend.service;

import com.backend.model.User;
import com.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegister_Success() {
        User user = new User();
        user.setName("name");
        user.setEmail("email");
        user.setPassword("password");
        when(userRepository.existsByEmail("email")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(user);
        User result = authService.register(user);
        assertEquals("name", result.getName());
    }

    @Test
    void testRegister_EmailExists() {
        User user = new User();
        user.setName("name");
        user.setEmail("email");
        user.setPassword("password");
        when(userRepository.existsByEmail("email")).thenReturn(true);
        assertThrows(RuntimeException.class, () -> authService.register(user));
    }

    @Test
    void testRegister_NullEmail() {
        User user = new User();
        user.setName("name");
        user.setPassword("password");
        user.setEmail(null);
        assertThrows(IllegalArgumentException.class, () -> authService.register(user));
    }

    @Test
    void testRegister_EmptyEmail() {
        User user = new User();
        user.setName("name");
        user.setPassword("password");
        user.setEmail("");
        assertThrows(IllegalArgumentException.class, () -> authService.register(user));
    }

    @Test
    void testRegister_WhitespaceEmail() {
        User user = new User();
        user.setName("name");
        user.setPassword("password");
        user.setEmail("   ");
        assertThrows(IllegalArgumentException.class, () -> authService.register(user));
    }

    @Test
    void testRegister_NullPassword() {
        User user = new User();
        user.setName("name");
        user.setEmail("email");
        user.setPassword(null);
        assertThrows(IllegalArgumentException.class, () -> authService.register(user));
    }

    @Test
    void testRegister_EmptyPassword() {
        User user = new User();
        user.setName("name");
        user.setEmail("email");
        user.setPassword("");
        assertThrows(IllegalArgumentException.class, () -> authService.register(user));
    }

    @Test
    void testRegister_WhitespacePassword() {
        User user = new User();
        user.setName("name");
        user.setEmail("email");
        user.setPassword("   ");
        assertThrows(IllegalArgumentException.class, () -> authService.register(user));
    }

    @Test
    void testRegister_NullName() {
        User user = new User();
        user.setEmail("email");
        user.setPassword("password");
        user.setName(null);
        assertThrows(IllegalArgumentException.class, () -> authService.register(user));
    }

    @Test
    void testRegister_EmptyName() {
        User user = new User();
        user.setEmail("email");
        user.setPassword("password");
        user.setName("");
        assertThrows(IllegalArgumentException.class, () -> authService.register(user));
    }

    @Test
    void testRegister_WhitespaceName() {
        User user = new User();
        user.setEmail("email");
        user.setPassword("password");
        user.setName("   ");
        assertThrows(IllegalArgumentException.class, () -> authService.register(user));
    }

    @Test
    void testFindByEmail_Success() {
        User user = new User();
        user.setEmail("email");
        when(userRepository.findByEmail("email")).thenReturn(Optional.of(user));
        User result = authService.findByEmail("email");
        assertEquals("email", result.getEmail());
    }

    @Test
    void testFindByEmail_NotFound() {
        when(userRepository.findByEmail("email")).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> authService.findByEmail("email"));
    }

    @Test
    void testFindByEmail_Null() {
        assertThrows(RuntimeException.class, () -> authService.findByEmail(null));
    }

    @Test
    void testFindByEmail_Empty() {
        assertThrows(RuntimeException.class, () -> authService.findByEmail(""));
    }

    @Test
    void testChangePassword_Success() {
        User user = new User();
        user.setPassword("encoded");
        when(userRepository.findByEmail("email")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old", "encoded")).thenReturn(true);
        when(passwordEncoder.encode("new")).thenReturn("encodedNew");
        when(userRepository.save(any(User.class))).thenReturn(user);
        assertDoesNotThrow(() -> authService.changePassword("email", "old", "new"));
    }

    @Test
    void testChangePassword_WrongCurrent() {
        User user = new User();
        user.setPassword("encoded");
        when(userRepository.findByEmail("email")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old", "encoded")).thenReturn(false);
        assertThrows(RuntimeException.class, () -> authService.changePassword("email", "old", "new"));
    }

    @Test
    void testChangePassword_UserNotFound() {
        when(userRepository.findByEmail("email")).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> authService.changePassword("email", "old", "new"));
    }

    @Test
    void testChangePassword_NullEmail() {
        assertThrows(RuntimeException.class, () -> authService.changePassword(null, "old", "new"));
    }

    @Test
    void testChangePassword_EmptyEmail() {
        assertThrows(RuntimeException.class, () -> authService.changePassword("", "old", "new"));
    }

    @Test
    void testChangePassword_NullCurrentPassword() {
        User user = new User();
        user.setPassword("encoded");
        when(userRepository.findByEmail("email")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(null, "encoded")).thenReturn(false);
        assertThrows(RuntimeException.class, () -> authService.changePassword("email", null, "new"));
    }

    @Test
    void testChangePassword_NullNewPassword() {
        User user = new User();
        user.setPassword("encoded");
        when(userRepository.findByEmail("email")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old", "encoded")).thenReturn(true);
        when(passwordEncoder.encode(null)).thenReturn(null);
        when(userRepository.save(any(User.class))).thenReturn(user);
        assertDoesNotThrow(() -> authService.changePassword("email", "old", null));
    }

    @Test
    void testUpdateTimezone_Success() {
        User user = new User();
        when(userRepository.findByEmail("email")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        assertDoesNotThrow(() -> authService.updateTimezone("email", "Asia/Kolkata"));
    }

    @Test
    void testUpdateTimezone_UserNotFound() {
        when(userRepository.findByEmail("email")).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> authService.updateTimezone("email", "Asia/Kolkata"));
    }

    @Test
    void testUpdateTimezone_NullEmail() {
        assertThrows(RuntimeException.class, () -> authService.updateTimezone(null, "Asia/Kolkata"));
    }

    @Test
    void testUpdateTimezone_EmptyEmail() {
        assertThrows(RuntimeException.class, () -> authService.updateTimezone("", "Asia/Kolkata"));
    }
}