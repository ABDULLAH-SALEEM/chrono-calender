import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { invitationService } from "../services/apis";
import { useNavigate } from "react-router-dom";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const response = await invitationService.getInvitations();
      setInvitations(response.data);
    } catch (error) {
      console.error("Error fetching invitations:", error);
      setError("Failed to load invitations");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId) => {
    try {
      await invitationService.acceptInvitation(invitationId);
      // Remove the invitation from the list
      setInvitations(invitations.filter((inv) => inv.id !== invitationId));
      // You could add a success message here
    } catch (error) {
      console.error("Error accepting invitation:", error);
      setError("Failed to accept invitation");
    }
  };

  const handleDeclineInvitation = async (invitationId) => {
    try {
      await invitationService.declineInvitation(invitationId);
      // Remove the invitation from the list
      setInvitations(invitations.filter((inv) => inv.id !== invitationId));
      // You could add a success message here
    } catch (error) {
      console.error("Error declining invitation:", error);
      setError("Failed to decline invitation");
    }
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {invitations.length === 0 ? (
        <Card>
          <CardContent>
            <Typography variant="h6" color="text.secondary" align="center">
              No pending invitations
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {invitations.map((invitation) => (
            <Card key={invitation.id}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {invitation.event.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {invitation.event.description}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Start:</strong>{" "}
                    {formatDateTime(invitation.event.start)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>End:</strong> {formatDateTime(invitation.event.end)}
                  </Typography>
                </Stack>

                {invitation.event.location && (
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>Location:</strong> {invitation.event.location}
                  </Typography>
                )}

                {invitation.event.priority && (
                  <Chip
                    label={invitation.event.priority.toUpperCase()}
                    color={
                      invitation.event.priority === "high"
                        ? "error"
                        : invitation.event.priority === "medium"
                          ? "warning"
                          : invitation.event.priority === "critical"
                            ? "error"
                            : "default"
                    }
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
                )}

                {invitation.event.tags && invitation.event.tags.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {invitation.event.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                )}

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Invited by:{" "}
                  {invitation.event.owner.name || invitation.event.owner.email}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Invited on: {formatDateTime(invitation.createdAt)}
                </Typography>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAcceptInvitation(invitation.id)}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeclineInvitation(invitation.id)}
                  >
                    Decline
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
