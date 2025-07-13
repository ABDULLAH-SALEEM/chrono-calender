package com.backend.util;

import com.backend.dto.UserDTO;
import com.backend.model.User;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class DTOConverterTest {
    @Test
    void testToUserDTO_Null() {
        assertNull(DTOConverter.toUserDTO(null));
    }

    @Test
    void testToUserDTO_Valid() {
        User user = new User();
        user.setId("1");
        user.setName("name");
        user.setEmail("email");
        user.setTimezone("Europe/Berlin");
        UserDTO dto = DTOConverter.toUserDTO(user);
        assertEquals("1", dto.getId());
        assertEquals("name", dto.getName());
        assertEquals("email", dto.getEmail());
        assertEquals("Europe/Berlin", dto.getTimezone());
    }

    @Test
    void testToUserDTOList_Null() {
        List<UserDTO> dtos = DTOConverter.toUserDTOList(null);
        assertNotNull(dtos);
        assertTrue(dtos.isEmpty());
    }

    @Test
    void testToUserDTOList_Valid() {
        User user1 = new User();
        user1.setId("1");
        user1.setName("name1");
        user1.setEmail("email1");
        user1.setTimezone("Europe/Berlin");
        User user2 = new User();
        user2.setId("2");
        user2.setName("name2");
        user2.setEmail("email2");
        user2.setTimezone("Europe/Berlin");
        List<UserDTO> dtos = DTOConverter.toUserDTOList(Arrays.asList(user1, user2));
        assertEquals(2, dtos.size());
        assertEquals("1", dtos.get(0).getId());
        assertEquals("2", dtos.get(1).getId());
    }
}