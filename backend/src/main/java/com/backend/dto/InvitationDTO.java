package com.backend.dto;

import com.backend.model.Invitation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvitationDTO {
    private String id;
    private EventDTO event;
    private UserDTO invitedUser;
    private LocalDateTime createdAt;

    public static InvitationDTO fromInvitation(Invitation invitation) {
        InvitationDTO dto = new InvitationDTO();
        dto.setId(invitation.getId());
        dto.setEvent(EventDTO.fromEvent(invitation.getEvent()));
        dto.setInvitedUser(UserDTO.fromUser(invitation.getInvitedUser()));
        dto.setCreatedAt(invitation.getCreatedAt());
        return dto;
    }
}