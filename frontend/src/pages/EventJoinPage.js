import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { eventService } from "../services/apis";

export default function EventJoinPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvent(eventId);
      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event details:", error);
      setError(
        "Failed to load event details. The event may not exist or you may not have access to it."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    try {
      setJoining(true);
      await eventService.joinEvent(eventId);
      setSuccess(true);
      // Redirect to calendar after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error joining event:", error);
      setError(error.response?.data?.message || "Failed to join event");
    } finally {
      setJoining(false);
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

  if (error && !event) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => navigate("/")}>
          Go to Calendar
        </Button>
      </Box>
    );
  }

  if (success) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Successfully joined the event! Redirecting to calendar...
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Join Event
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {event && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {event.title}
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
              {event.description}
            </Typography>

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Start Time:
                </Typography>
                <Typography variant="body2">
                  {formatDateTime(event.start)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" fontWeight="bold">
                  End Time:
                </Typography>
                <Typography variant="body2">
                  {formatDateTime(event.end)}
                </Typography>
              </Box>

              {event.location && (
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Location:
                  </Typography>
                  <Typography variant="body2">{event.location}</Typography>
                </Box>
              )}

              {event.priority && (
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Priority:
                  </Typography>
                  <Chip
                    label={event.priority.toUpperCase()}
                    color={
                      event.priority === "high"
                        ? "error"
                        : event.priority === "medium"
                          ? "warning"
                          : event.priority === "critical"
                            ? "error"
                            : "default"
                    }
                    size="small"
                  />
                </Box>
              )}

              {event.tags && event.tags.length > 0 && (
                <Box>
                  <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                    Tags:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {event.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <Box>
                <Typography variant="body2" fontWeight="bold">
                  Organized by:
                </Typography>
                <Typography variant="body2">
                  {event.owner.name || event.owner.email}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleJoinEvent}
                disabled={joining}
                startIcon={joining ? <CircularProgress size={20} /> : null}
              >
                {joining ? "Joining..." : "Join Event"}
              </Button>
              <Button variant="outlined" onClick={() => navigate("/")}>
                Cancel
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
