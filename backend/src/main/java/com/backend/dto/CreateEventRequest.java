package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateEventRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Start date/time is required")
    private LocalDateTime start;

    @NotNull(message = "End date/time is required")
    private LocalDateTime end;

    private String priority; // high, medium, low, critical
    private String recurring; // daily, weekly, monthly, or empty
    private List<String> tags;
    private List<String> userIds; // IDs of users to invite
}