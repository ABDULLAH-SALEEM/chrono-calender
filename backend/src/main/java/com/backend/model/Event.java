package com.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    @Id
    private String id;

    private String title;
    private String description;
    private LocalDateTime start;
    private LocalDateTime end;
    private String priority; // high, medium, low, critical
    private String recurring; // daily, weekly, monthly, or empty
    private List<String> tags;
    private String color; // hex color code for event background
    private String location; // optional location field

    @DBRef
    private User owner;

    @DBRef
    private List<User> users;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}