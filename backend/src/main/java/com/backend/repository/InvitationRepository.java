package com.backend.repository;

import com.backend.model.Invitation;
import com.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface InvitationRepository extends MongoRepository<Invitation, String> {

    // Find all invitations for a specific user
    List<Invitation> findByInvitedUser(User invitedUser);

    // Find invitation by event and user
    Optional<Invitation> findByEventIdAndInvitedUserId(String eventId, String userId);

    // Find all invitations for a specific event
    List<Invitation> findByEventId(String eventId);

    // Delete all invitations for a specific event
    void deleteByEventId(String eventId);

    // Delete invitation by event and user
    void deleteByEventIdAndInvitedUserId(String eventId, String userId);
}