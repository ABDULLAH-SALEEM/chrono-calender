package com.backend.controller;

import com.backend.dto.InvitationDTO;
import com.backend.service.InvitationService;
import com.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/invitations")
@CrossOrigin(origins = "*")
public class InvitationController {
    private static final Logger logger = LoggerFactory.getLogger(InvitationController.class);

    @Autowired
    private InvitationService invitationService;

    @Autowired
    private JwtService jwtService;

    @GetMapping
    public ResponseEntity<List<InvitationDTO>> getInvitations(
            @RequestHeader("Authorization") String token) {
        logger.info("Getting invitations for user");

        String email = jwtService.extractUsername(token.substring(7));
        List<InvitationDTO> invitations = invitationService.getInvitationsForUser(email);

        return ResponseEntity.ok(invitations);
    }

    @PostMapping("/{invitationId}/accept")
    public ResponseEntity<Void> acceptInvitation(
            @PathVariable String invitationId,
            @RequestHeader("Authorization") String token) {
        logger.info("Accepting invitation: {}", invitationId);

        String email = jwtService.extractUsername(token.substring(7));
        invitationService.acceptInvitation(invitationId, email);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/{invitationId}/decline")
    public ResponseEntity<Void> declineInvitation(
            @PathVariable String invitationId,
            @RequestHeader("Authorization") String token) {
        logger.info("Declining invitation: {}", invitationId);

        String email = jwtService.extractUsername(token.substring(7));
        invitationService.declineInvitation(invitationId, email);

        return ResponseEntity.ok().build();
    }
}