package com.backend.util;

import com.backend.dto.UserDTO;
import com.backend.model.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DTOConverter {

    public static UserDTO toUserDTO(User user) {
        if (user == null)
            return null;
        return UserDTO.fromUser(user);
    }

    public static List<UserDTO> toUserDTOList(List<User> users) {
        if (users == null)
            return java.util.Collections.emptyList();
        return users.stream()
                .map(UserDTO::fromUser)
                .collect(Collectors.toList());
    }

    // Add more conversion methods for other entities as needed
    // For example:
    // public static TodoDTO toTodoDTO(Todo todo) { ... }
    // public static List<TodoDTO> toTodoDTOList(List<Todo> todos) { ... }
}