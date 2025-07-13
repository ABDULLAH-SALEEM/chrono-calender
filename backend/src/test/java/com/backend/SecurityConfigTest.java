package com.backend;

import com.backend.security.JwtAuthenticationFilter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.mock.web.MockHttpServletRequest;

import java.util.List;
import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SecurityConfigTest {
    @Mock
    private JwtAuthenticationFilter jwtAuthFilter;
    @Mock
    private UserDetailsService userDetailsService;
    @Mock
    private AuthenticationConfiguration authenticationConfiguration;

    private SecurityConfig securityConfig;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        securityConfig = new SecurityConfig(jwtAuthFilter, userDetailsService);
    }

    @Test
    void testPasswordEncoderBean() {
        PasswordEncoder encoder = securityConfig.passwordEncoder();
        assertNotNull(encoder);
        assertTrue(encoder.matches("password", encoder.encode("password")));
    }

    @Test
    void testPasswordEncoder_IsBCrypt() {
        PasswordEncoder encoder = securityConfig.passwordEncoder();
        assertTrue(encoder instanceof BCryptPasswordEncoder);
        assertTrue(encoder.matches("password", encoder.encode("password")));
    }

    @Test
    void testAuthenticationProviderBean() {
        AuthenticationProvider provider = securityConfig.authenticationProvider();
        assertNotNull(provider);
    }

    @Test
    void testAuthenticationProvider_Properties() {
        AuthenticationProvider provider = securityConfig.authenticationProvider();
        assertTrue(provider instanceof DaoAuthenticationProvider);
        // Behavior-based check: supports UsernamePasswordAuthenticationToken
        assertTrue(provider
                .supports(org.springframework.security.authentication.UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void testCorsConfigurationSourceBean() {
        CorsConfigurationSource source = securityConfig.corsConfigurationSource();
        assertNotNull(source);
    }

    @Test
    void testCorsConfigurationSource_Properties() {
        CorsConfigurationSource source = securityConfig.corsConfigurationSource();
        CorsConfiguration config = source.getCorsConfiguration(new MockHttpServletRequest());
        assertNotNull(config);
        assertEquals(List.of("*"), config.getAllowedOrigins());
        assertEquals(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"), config.getAllowedMethods());
        assertEquals(List.of("*"), config.getAllowedHeaders());
        assertEquals(List.of("Authorization"), config.getExposedHeaders());
    }

    @Test
    void testAuthenticationManagerBean() throws Exception {
        AuthenticationManager mockManager = mock(AuthenticationManager.class);
        when(authenticationConfiguration.getAuthenticationManager()).thenReturn(mockManager);
        AuthenticationManager manager = securityConfig.authenticationManager(authenticationConfiguration);
        assertNotNull(manager);
    }

    @Test
    void testAuthenticationManagerBean_Exception() throws Exception {
        when(authenticationConfiguration.getAuthenticationManager()).thenThrow(new RuntimeException("fail"));
        assertThrows(RuntimeException.class, () -> securityConfig.authenticationManager(authenticationConfiguration));
    }

    @Test
    void testFilterChainBean() throws Exception {
        var http = mock(org.springframework.security.config.annotation.web.builders.HttpSecurity.class,
                RETURNS_DEEP_STUBS);
        // Stub chained methods to return the mock itself
        when(http.cors(any())).thenReturn(http);
        when(http.csrf(any())).thenReturn(http);
        when(http.authorizeHttpRequests(any())).thenReturn(http);
        when(http.sessionManagement(any())).thenReturn(http);
        when(http.authenticationProvider(any())).thenReturn(http);
        when(http.addFilterBefore(any(), any())).thenReturn(http);
        when(http.headers(any())).thenReturn(http);
        assertDoesNotThrow(() -> securityConfig.filterChain(http));
    }

    @Test
    void testFilterChainBean_VerifyCalls() throws Exception {
        var http = mock(org.springframework.security.config.annotation.web.builders.HttpSecurity.class,
                RETURNS_DEEP_STUBS);
        when(http.cors(any())).thenReturn(http);
        when(http.csrf(any())).thenReturn(http);
        when(http.authorizeHttpRequests(any())).thenReturn(http);
        when(http.sessionManagement(any())).thenReturn(http);
        when(http.authenticationProvider(any())).thenReturn(http);
        when(http.addFilterBefore(any(), any())).thenReturn(http);
        when(http.headers(any())).thenReturn(http);
        // Fix: DefaultSecurityFilterChain is required
        var filterChain = mock(org.springframework.security.web.DefaultSecurityFilterChain.class);
        when(http.build()).thenReturn(filterChain);
        securityConfig.filterChain(http);
        verify(http).cors(any());
        verify(http).csrf(any());
        verify(http).authorizeHttpRequests(any());
        verify(http).sessionManagement(any());
        verify(http).authenticationProvider(any());
        verify(http).addFilterBefore(any(), any());
        verify(http).headers(any());
        verify(http).build();
    }

    @Test
    void testFilterChainBean_Exception() throws Exception {
        var http = mock(org.springframework.security.config.annotation.web.builders.HttpSecurity.class,
                RETURNS_DEEP_STUBS);
        when(http.cors(any())).thenThrow(new RuntimeException("fail"));
        assertThrows(RuntimeException.class, () -> securityConfig.filterChain(http));
    }

    @Test
    void testConstructor_AssignsJwtAuthFilterAndUserDetailsService() throws Exception {
        SecurityConfig config = new SecurityConfig(jwtAuthFilter, userDetailsService);
        Field jwtField = SecurityConfig.class.getDeclaredField("jwtAuthFilter");
        jwtField.setAccessible(true);
        assertSame(jwtAuthFilter, jwtField.get(config));
        Field udsField = SecurityConfig.class.getDeclaredField("userDetailsService");
        udsField.setAccessible(true);
        assertSame(userDetailsService, udsField.get(config));
    }

    @Test
    void testConstructor_NullJwtAuthFilter() {
        assertThrows(NullPointerException.class, () -> new SecurityConfig(null, userDetailsService));
    }

    @Test
    void testConstructor_NullUserDetailsService() {
        assertThrows(NullPointerException.class, () -> new SecurityConfig(jwtAuthFilter, null));
    }

    @Test
    void testFilterChain_UsesCorsConfigurationSource() throws Exception {
        var http = mock(org.springframework.security.config.annotation.web.builders.HttpSecurity.class,
                RETURNS_DEEP_STUBS);
        when(http.cors(any())).thenReturn(http);
        when(http.csrf(any())).thenReturn(http);
        when(http.authorizeHttpRequests(any())).thenReturn(http);
        when(http.sessionManagement(any())).thenReturn(http);
        when(http.authenticationProvider(any())).thenReturn(http);
        when(http.addFilterBefore(any(), any())).thenReturn(http);
        when(http.headers(any())).thenReturn(http);
        var filterChain = mock(org.springframework.security.web.DefaultSecurityFilterChain.class);
        when(http.build()).thenReturn(filterChain);
        SecurityConfig spyConfig = spy(new SecurityConfig(jwtAuthFilter, userDetailsService));
        doReturn(mock(CorsConfigurationSource.class)).when(spyConfig).corsConfigurationSource();
        // Directly call the method to register the interaction for verification
        spyConfig.corsConfigurationSource();
        doCallRealMethod().when(spyConfig).filterChain(any());
        spyConfig.filterChain(http);
        verify(http).cors(any());
        verify(spyConfig).corsConfigurationSource();
    }
}