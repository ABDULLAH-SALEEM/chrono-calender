package com.backend.service;

import com.backend.dto.InvitationDTO;
import com.backend.model.Event;
import com.backend.model.Invitation;
import com.backend.model.User;
import com.backend.repository.EventRepository;
import com.backend.repository.InvitationRepository;
import com.backend.repository.UserRepository;
import com.backend.exception.EventException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvitationService {
    private static final Logger logger = LoggerFactory.getLogger(InvitationService.class);

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public void createInvitations(String eventId, List<String> userIds, String ownerEmail) {
        logger.info("Creating invitations for event: {} with users: {}", eventId, userIds);

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EventException("Event not found"));

        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new EventException("User not found"));

        // Only owner can create invitations
        if (!event.getOwner().getId().equals(owner.getId())) {
            throw new EventException("Only event owner can create invitations");
        }

        for (String userId : userIds) {
            // Skip if user is the owner
            if (userId.equals(owner.getId())) {
                continue;
            }

            User invitedUser = userRepository.findById(userId)
                    .orElseThrow(() -> new EventException("User not found: " + userId));

            // Check if invitation already exists
            if (invitationRepository.findByEventIdAndInvitedUserId(eventId, userId).isPresent()) {
                logger.info("Invitation already exists for user: {} and event: {}", userId, eventId);
                continue;
            }

            // Check if user is already in the event
            if (event.getUsers().stream().anyMatch(u -> u.getId().equals(userId))) {
                logger.info("User: {} is already in event: {}", userId, eventId);
                continue;
            }

            Invitation invitation = new Invitation();
            invitation.setEvent(event);
            invitation.setInvitedUser(invitedUser);

            invitationRepository.save(invitation);
            logger.info("Created invitation for user: {} to event: {}", userId, eventId);
        }
    }

    public List<InvitationDTO> getInvitationsForUser(String userEmail) {
        logger.info("Getting invitations for user: {}", userEmail);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EventException("User not found"));

        List<Invitation> invitations = invitationRepository.findByInvitedUser(user);

        return invitations.stream()
                .map(InvitationDTO::fromInvitation)
                .collect(Collectors.toList());
    }

    public void acceptInvitation(String invitationId, String userEmail) {
        logger.info("User: {} accepting invitation: {}", userEmail, invitationId);

        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new EventException("Invitation not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EventException("User not found"));

        // Verify the invitation is for this user
        if (!invitation.getInvitedUser().getId().equals(user.getId())) {
            throw new EventException("Access denied");
        }

        Event event = invitation.getEvent();

        // Add user to event
        if (!event.getUsers().stream().anyMatch(u -> u.getId().equals(user.getId()))) {
            event.getUsers().add(user);
            event.setUpdatedAt(java.time.LocalDateTime.now());
            eventRepository.save(event);
        }

        // Delete the invitation
        invitationRepository.delete(invitation);

        logger.info("Invitation accepted successfully: {}", invitationId);
    }

    public void declineInvitation(String invitationId, String userEmail) {
        logger.info("User: {} declining invitation: {}", userEmail, invitationId);

        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new EventException("Invitation not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EventException("User not found"));

        // Verify the invitation is for this user
        if (!invitation.getInvitedUser().getId().equals(user.getId())) {
            throw new EventException("Access denied");
        }

        // Delete the invitation
        invitationRepository.delete(invitation);

        logger.info("Invitation declined successfully: {}", invitationId);
    }

    public void deleteInvitationsForEvent(String eventId) {
        logger.info("Deleting all invitations for event: {}", eventId);
        invitationRepository.deleteByEventId(eventId);
    }
}