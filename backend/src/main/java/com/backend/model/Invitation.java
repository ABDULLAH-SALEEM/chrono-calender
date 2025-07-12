package com.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

@Document(collection = "invitations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Invitation {
    @Id
    private String id;

    @DBRef
    private Event event;

    @DBRef
    private User invitedUser;

    private LocalDateTime createdAt = LocalDateTime.now();
}