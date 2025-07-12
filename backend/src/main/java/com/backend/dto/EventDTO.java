package com.backend.dto;

import com.backend.model.Event;
import com.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private String id;
    private String title;
    private String description;
    private LocalDateTime start;
    private LocalDateTime end;
    private String priority;
    private String recurring;
    private List<String> tags;
    private UserDTO owner;
    private List<UserDTO> users;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String location; // optional location field

    public static EventDTO fromEvent(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setDescription(event.getDescription());
        dto.setStart(event.getStart());
        dto.setEnd(event.getEnd());
        dto.setPriority(event.getPriority());
        dto.setRecurring(event.getRecurring());
        dto.setTags(event.getTags());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());
        dto.setLocation(event.getLocation()); // map location

        if (event.getOwner() != null) {
            dto.setOwner(UserDTO.fromUser(event.getOwner()));
        }

        if (event.getUsers() != null) {
            dto.setUsers(event.getUsers().stream()
                    .map(UserDTO::fromUser)
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}