import axios from "axios";
const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getCurrentUser: () => api.get("/auth/me"),
  changePassword: (data) => api.put("/auth/password", data),
  updateTimezone: (data) => api.put("/auth/timezone", data)
};

export const eventService = {
  // Get all events for the current user
  getAllEvents: () => api.get("/events"),

  // Get a specific event by ID
  getEvent: (eventId) => api.get(`/events/${eventId}`),

  // Create a new event
  createEvent: (eventData) => api.post("/events", eventData),

  // Update an existing event
  updateEvent: (eventId, eventData) => api.put(`/events/${eventId}`, eventData),

  // Delete an event
  deleteEvent: (eventId) => api.delete(`/events/${eventId}`),

  // Join an event
  joinEvent: (eventId) => api.post(`/events/${eventId}/join`),

  // Leave an event
  leaveEvent: (eventId) => api.post(`/events/${eventId}/leave`)
};

export const invitationService = {
  // Get all invitations for the current user
  getInvitations: () => api.get("/invitations"),

  // Accept an invitation
  acceptInvitation: (invitationId) =>
    api.post(`/invitations/${invitationId}/accept`),

  // Decline an invitation
  declineInvitation: (invitationId) =>
    api.post(`/invitations/${invitationId}/decline`)
};

export const userService = {
  // Get all users (excluding current user)
  getAllUsers: () => api.get("/users")
};

export default api;
