package com.backend.service;

import com.backend.dto.CreateEventRequest;
import com.backend.dto.EventDTO;
import com.backend.dto.UpdateEventRequest;
import com.backend.model.Event;
import com.backend.model.User;
import com.backend.repository.EventRepository;
import com.backend.repository.UserRepository;
import com.backend.exception.EventException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {
        private static final Logger logger = LoggerFactory.getLogger(EventService.class);

        @Autowired
        private EventRepository eventRepository;

        @Autowired
        private UserRepository userRepository;

        public EventDTO createEvent(CreateEventRequest request, String ownerEmail) {
                logger.info("Creating event: {} for user: {}", request.getTitle(), ownerEmail);

                User owner = userRepository.findByEmail(ownerEmail)
                                .orElseThrow(() -> new EventException("User not found"));

                Event event = new Event();
                event.setTitle(request.getTitle());
                event.setDescription(request.getDescription());
                event.setStart(request.getStart());
                event.setEnd(request.getEnd());
                event.setPriority(request.getPriority());
                event.setRecurring(request.getRecurring());
                event.setTags(request.getTags());
                event.setLocation(request.getLocation()); // set location
                event.setOwner(owner);
                event.setUsers(new ArrayList<>());
                event.getUsers().add(owner); // Add owner to users list initially

                // Add invited users if any
                if (request.getUserIds() != null && !request.getUserIds().isEmpty()) {
                        List<User> invitedUsers = userRepository.findAllById(request.getUserIds());
                        event.getUsers().addAll(invitedUsers);
                }

                Event savedEvent = eventRepository.save(event);
                logger.info("Event created successfully: {}", savedEvent.getId());

                return EventDTO.fromEvent(savedEvent);
        }

        public EventDTO getEventById(String eventId, String userEmail) {
                logger.info("Getting event: {} for user: {}", eventId, userEmail);

                Event event = eventRepository.findById(eventId)
                                .orElseThrow(() -> new EventException("Event not found"));

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new EventException("User not found"));

                // Check if user has access to this event
                if (!event.getOwner().getId().equals(user.getId()) &&
                                !event.getUsers().stream().anyMatch(u -> u.getId().equals(user.getId()))) {
                        throw new EventException("Access denied");
                }

                return EventDTO.fromEvent(event);
        }

        public List<EventDTO> getAllEvents(String userEmail) {
                logger.info("Getting all events for user: {}", userEmail);

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new EventException("User not found"));

                logger.info("Found user with ID: {}", user.getId());

                // Try the new query with user ID
                List<Event> events = eventRepository.findByOwnerOrUsersContaining(user.getId());

                logger.info("Found {} events for user: {}", events.size(), userEmail);

                // Also try the old method as fallback for debugging
                if (events.isEmpty()) {
                        logger.warn("No events found with new query, trying alternative methods...");

                        // Try finding events where user is owner
                        List<Event> ownerEvents = eventRepository.findByOwner(user);
                        logger.info("Found {} events where user is owner", ownerEvents.size());

                        // Try finding events where user is participant
                        List<Event> participantEvents = eventRepository.findByUsersContaining(user);
                        logger.info("Found {} events where user is participant", participantEvents.size());

                        // Combine both lists
                        events = new ArrayList<>();
                        events.addAll(ownerEvents);
                        events.addAll(participantEvents);

                        // Remove duplicates
                        events = events.stream().distinct().collect(Collectors.toList());
                        logger.info("Combined total events: {}", events.size());
                }

                return events.stream()
                                .map(EventDTO::fromEvent)
                                .collect(Collectors.toList());
        }

        public List<EventDTO> getEventsByDateRange(String userEmail, LocalDateTime start, LocalDateTime end) {
                logger.info("Getting events for user: {} between {} and {}", userEmail, start, end);

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new EventException("User not found"));

                List<Event> events = eventRepository.findByOwnerOrUsersContaining(user.getId());

                // Filter events within the date range
                return events.stream()
                                .filter(event -> !event.getEnd().isBefore(start) && !event.getStart().isAfter(end))
                                .map(EventDTO::fromEvent)
                                .collect(Collectors.toList());
        }

        public EventDTO updateEvent(String eventId, UpdateEventRequest request, String userEmail) {
                logger.info("Updating event: {} for user: {}", eventId, userEmail);

                Event event = eventRepository.findById(eventId)
                                .orElseThrow(() -> new EventException("Event not found"));

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new EventException("User not found"));

                // Only owner can update the event
                if (!event.getOwner().getId().equals(user.getId())) {
                        throw new EventException("Only event owner can update the event");
                }

                event.setTitle(request.getTitle());
                event.setDescription(request.getDescription());
                event.setStart(request.getStart());
                event.setEnd(request.getEnd());
                event.setPriority(request.getPriority());
                event.setRecurring(request.getRecurring());
                event.setTags(request.getTags());
                event.setLocation(request.getLocation()); // set location
                event.setUpdatedAt(LocalDateTime.now());

                // Update invited users if provided
                if (request.getUserIds() != null) {
                        List<User> invitedUsers = userRepository.findAllById(request.getUserIds());
                        event.setUsers(invitedUsers);
                        event.getUsers().add(user); // Ensure owner is in the list
                }

                Event updatedEvent = eventRepository.save(event);
                logger.info("Event updated successfully: {}", updatedEvent.getId());

                return EventDTO.fromEvent(updatedEvent);
        }

        public void deleteEvent(String eventId, String userEmail) {
                logger.info("Deleting event: {} for user: {}", eventId, userEmail);

                Event event = eventRepository.findById(eventId)
                                .orElseThrow(() -> new EventException("Event not found"));

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new EventException("User not found"));

                // Only owner can delete the event
                if (!event.getOwner().getId().equals(user.getId())) {
                        throw new EventException("Only event owner can delete the event");
                }

                eventRepository.delete(event);
                logger.info("Event deleted successfully: {}", eventId);
        }

        public EventDTO joinEvent(String eventId, String userEmail) {
                logger.info("User: {} joining event: {}", userEmail, eventId);

                Event event = eventRepository.findById(eventId)
                                .orElseThrow(() -> new EventException("Event not found"));

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new EventException("User not found"));

                // Check if user is already in the event
                if (event.getUsers().stream().anyMatch(u -> u.getId().equals(user.getId()))) {
                        throw new EventException("User is already part of this event");
                }

                event.getUsers().add(user);
                event.setUpdatedAt(LocalDateTime.now());

                Event updatedEvent = eventRepository.save(event);
                logger.info("User joined event successfully: {}", eventId);

                return EventDTO.fromEvent(updatedEvent);
        }

        public EventDTO leaveEvent(String eventId, String userEmail) {
                logger.info("User: {} leaving event: {}", userEmail, eventId);

                Event event = eventRepository.findById(eventId)
                                .orElseThrow(() -> new EventException("Event not found"));

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new EventException("User not found"));

                // Owner cannot leave their own event
                if (event.getOwner().getId().equals(user.getId())) {
                        throw new EventException("Event owner cannot leave the event");
                }

                // Remove user from event
                event.setUsers(event.getUsers().stream()
                                .filter(u -> !u.getId().equals(user.getId()))
                                .collect(Collectors.toList()));

                event.setUpdatedAt(LocalDateTime.now());

                Event updatedEvent = eventRepository.save(event);
                logger.info("User left event successfully: {}", eventId);

                return EventDTO.fromEvent(updatedEvent);
        }

        public List<EventDTO> getEventsByPriority(String userEmail, String priority) {
                logger.info("Getting events with priority: {} for user: {}", priority, userEmail);

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new EventException("User not found"));

                List<Event> events = eventRepository.findByOwnerOrUsersContaining(user.getId());

                return events.stream()
                                .filter(event -> priority.equals(event.getPriority()))
                                .map(EventDTO::fromEvent)
                                .collect(Collectors.toList());
        }

        public List<EventDTO> getEventsByTag(String userEmail, String tag) {
                logger.info("Getting events with tag: {} for user: {}", tag, userEmail);

                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new EventException("User not found"));

                List<Event> events = eventRepository.findByOwnerOrUsersContaining(user.getId());

                return events.stream()
                                .filter(event -> event.getTags() != null && event.getTags().contains(tag))
                                .map(EventDTO::fromEvent)
                                .collect(Collectors.toList());
        }
}