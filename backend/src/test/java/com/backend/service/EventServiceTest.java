package com.backend.service;

import com.backend.dto.CreateEventRequest;
import com.backend.dto.EventDTO;
import com.backend.dto.UpdateEventRequest;
import com.backend.exception.EventException;
import com.backend.model.Event;
import com.backend.model.User;
import com.backend.repository.EventRepository;
import com.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class EventServiceTest {
    @Mock
    private EventRepository eventRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private InvitationService invitationService;
    @InjectMocks
    private EventService eventService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateEvent_Success() {
        CreateEventRequest request = new CreateEventRequest();
        request.setTitle("title");
        request.setDescription("desc");
        request.setStart(LocalDateTime.now());
        request.setEnd(LocalDateTime.now().plusHours(1));
        request.setUserIds(Collections.emptyList());
        String ownerEmail = "owner@example.com";
        User owner = new User();
        owner.setId("1");
        when(userRepository.findByEmail(ownerEmail)).thenReturn(Optional.of(owner));
        when(eventRepository.save(any(Event.class))).thenAnswer(inv -> inv.getArgument(0));
        EventDTO dto = eventService.createEvent(request, ownerEmail);
        assertEquals("title", dto.getTitle());
    }

    @Test
    void testCreateEvent_UserNotFound() {
        CreateEventRequest request = new CreateEventRequest();
        String ownerEmail = "owner@example.com";
        when(userRepository.findByEmail(ownerEmail)).thenReturn(Optional.empty());
        assertThrows(EventException.class, () -> eventService.createEvent(request, ownerEmail));
    }

    @Test
    void testGetEventById_Success() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        Event event = new Event();
        User user = new User();
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        EventDTO dto = eventService.getEventById(eventId, userEmail);
        assertNotNull(dto);
    }

    @Test
    void testGetEventById_EventNotFound() {
        when(eventRepository.findById(anyString())).thenReturn(Optional.empty());
        assertThrows(EventException.class, () -> eventService.getEventById("e1", "user@example.com"));
    }

    @Test
    void testGetAllEvents_UserNotFound() {
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        assertThrows(EventException.class, () -> eventService.getAllEvents("user@example.com"));
    }

    @Test
    void testGetAllEvents_FallbackLogic() {
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("1");
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.findByOwnerOrUsersContaining(user.getId())).thenReturn(Collections.emptyList());
        when(eventRepository.findByOwner(user)).thenReturn(Collections.singletonList(new Event()));
        when(eventRepository.findByUsersContaining(user)).thenReturn(Collections.singletonList(new Event()));
        List<EventDTO> result = eventService.getAllEvents(userEmail);
        assertNotNull(result);
        assertTrue(result.size() >= 1);
    }

    @Test
    void testGetEventsByDateRange() {
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("1");
        Event event = new Event();
        event.setStart(LocalDateTime.now());
        event.setEnd(LocalDateTime.now().plusHours(1));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.findByOwnerOrUsersContaining(user.getId())).thenReturn(Collections.singletonList(event));
        List<EventDTO> result = eventService.getEventsByDateRange(userEmail, LocalDateTime.now().minusHours(1),
                LocalDateTime.now().plusHours(2));
        assertEquals(1, result.size());
    }

    @Test
    void testGetEventsByPriority() {
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("1");
        Event event = new Event();
        event.setPriority("high");
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.findByOwnerOrUsersContaining(user.getId())).thenReturn(Collections.singletonList(event));
        List<EventDTO> result = eventService.getEventsByPriority(userEmail, "high");
        assertEquals(1, result.size());
    }

    @Test
    void testGetEventsByTag() {
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("1");
        Event event = new Event();
        event.setTags(Collections.singletonList("work"));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.findByOwnerOrUsersContaining(user.getId())).thenReturn(Collections.singletonList(event));
        List<EventDTO> result = eventService.getEventsByTag(userEmail, "work");
        assertEquals(1, result.size());
    }

    @Test
    void testUpdateEvent_Success() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        UpdateEventRequest request = new UpdateEventRequest();
        Event event = new Event();
        User user = new User();
        user.setId("1");
        event.setOwner(user);
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        EventDTO dto = eventService.updateEvent(eventId, request, userEmail);
        assertNotNull(dto);
    }

    @Test
    void testUpdateEvent_NotOwner() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        UpdateEventRequest request = new UpdateEventRequest();
        Event event = new Event();
        User owner = new User();
        owner.setId("1");
        User user = new User();
        user.setId("2");
        event.setOwner(owner);
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        assertThrows(EventException.class, () -> eventService.updateEvent(eventId, request, userEmail));
    }

    @Test
    void testDeleteEvent_Success() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        Event event = new Event();
        User user = new User();
        user.setId("1");
        event.setOwner(user);
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        doNothing().when(invitationService).deleteInvitationsForEvent(eventId);
        doNothing().when(eventRepository).delete(event);
        assertDoesNotThrow(() -> eventService.deleteEvent(eventId, userEmail));
    }

    @Test
    void testDeleteEvent_NotOwner() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        Event event = new Event();
        User owner = new User();
        owner.setId("1");
        User user = new User();
        user.setId("2");
        event.setOwner(owner);
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        assertThrows(EventException.class, () -> eventService.deleteEvent(eventId, userEmail));
    }

    @Test
    void testJoinEvent_Success() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("2");
        User owner = new User();
        owner.setId("1");
        Event event = new Event();
        event.setOwner(owner);
        event.setUsers(new ArrayList<>(Collections.singletonList(owner)));
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        EventDTO dto = eventService.joinEvent(eventId, userEmail);
        assertNotNull(dto);
    }

    @Test
    void testJoinEvent_AlreadyInEvent() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("2");
        User owner = new User();
        owner.setId("1");
        Event event = new Event();
        event.setOwner(owner);
        event.setUsers(new ArrayList<>(Arrays.asList(owner, user)));
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        assertThrows(EventException.class, () -> eventService.joinEvent(eventId, userEmail));
    }

    @Test
    void testJoinEvent_OwnerCannotJoin() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        User owner = new User();
        owner.setId("1");
        Event event = new Event();
        event.setOwner(owner);
        event.setUsers(new ArrayList<>(Collections.singletonList(owner)));
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(owner));
        assertThrows(EventException.class, () -> eventService.joinEvent(eventId, userEmail));
    }

    @Test
    void testLeaveEvent_Success() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("2");
        User owner = new User();
        owner.setId("1");
        Event event = new Event();
        event.setOwner(owner);
        event.setUsers(new ArrayList<>(Arrays.asList(owner, user)));
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        EventDTO dto = eventService.leaveEvent(eventId, userEmail);
        assertNotNull(dto);
    }

    @Test
    void testLeaveEvent_OwnerCannotLeave() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        User owner = new User();
        owner.setId("1");
        Event event = new Event();
        event.setOwner(owner);
        event.setUsers(new ArrayList<>(Collections.singletonList(owner)));
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(owner));
        assertThrows(EventException.class, () -> eventService.leaveEvent(eventId, userEmail));
    }

    @Test
    void testCreateEvent_AllFieldsNull() {
        CreateEventRequest request = new CreateEventRequest();
        String ownerEmail = "owner@example.com";
        User owner = new User();
        owner.setId("1");
        when(userRepository.findByEmail(ownerEmail)).thenReturn(Optional.of(owner));
        when(eventRepository.save(any(Event.class))).thenAnswer(inv -> inv.getArgument(0));
        EventDTO dto = eventService.createEvent(request, ownerEmail);
        assertNull(dto.getDescription());
        assertNull(dto.getStart());
        assertNull(dto.getEnd());
        assertNull(dto.getPriority());
        assertNull(dto.getRecurring());
        assertNull(dto.getTags());
        assertNull(dto.getColor());
        assertNull(dto.getLocation());
    }

    @Test
    void testCreateEvent_AllFieldsNonNullAndUserIds() {
        CreateEventRequest request = new CreateEventRequest();
        request.setTitle("title");
        request.setDescription("desc");
        request.setStart(LocalDateTime.now());
        request.setEnd(LocalDateTime.now().plusHours(1));
        request.setPriority("high");
        request.setRecurring("daily");
        request.setTags(Arrays.asList("tag1", "tag2"));
        request.setColor("#fff");
        request.setLocation("room");
        request.setUserIds(Arrays.asList("2", "3"));
        String ownerEmail = "owner@example.com";
        User owner = new User();
        owner.setId("1");
        when(userRepository.findByEmail(ownerEmail)).thenReturn(Optional.of(owner));
        when(eventRepository.save(any(Event.class))).thenAnswer(inv -> inv.getArgument(0));
        Event event = new Event();
        event.setId("e1");
        doNothing().when(invitationService).createInvitations(anyString(), anyList(), eq(ownerEmail));
        EventDTO dto = eventService.createEvent(request, ownerEmail);
        assertEquals("desc", dto.getDescription());
        assertNotNull(dto.getStart());
        assertNotNull(dto.getEnd());
        assertEquals("high", dto.getPriority());
        assertEquals("daily", dto.getRecurring());
        assertEquals(Arrays.asList("tag1", "tag2"), dto.getTags());
        assertEquals("#fff", dto.getColor());
        assertEquals("room", dto.getLocation());
        verify(invitationService).createInvitations(isNull(), eq(Arrays.asList("2", "3")), eq(ownerEmail));
    }

    @Test
    void testCreateEvent_UserIdsNull() {
        CreateEventRequest request = new CreateEventRequest();
        request.setUserIds(null);
        String ownerEmail = "owner@example.com";
        User owner = new User();
        owner.setId("1");
        when(userRepository.findByEmail(ownerEmail)).thenReturn(Optional.of(owner));
        when(eventRepository.save(any(Event.class))).thenAnswer(inv -> inv.getArgument(0));
        assertDoesNotThrow(() -> eventService.createEvent(request, ownerEmail));
    }

    @Test
    void testCreateEvent_UserIdsEmpty() {
        CreateEventRequest request = new CreateEventRequest();
        request.setUserIds(Collections.emptyList());
        String ownerEmail = "owner@example.com";
        User owner = new User();
        owner.setId("1");
        when(userRepository.findByEmail(ownerEmail)).thenReturn(Optional.of(owner));
        when(eventRepository.save(any(Event.class))).thenAnswer(inv -> inv.getArgument(0));
        assertDoesNotThrow(() -> eventService.createEvent(request, ownerEmail));
    }

    @Test
    void testGetAllEvents_DuplicateEvents_Distinct() {
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("1");
        Event event1 = new Event();
        event1.setId("e1");
        Event event2 = new Event();
        event2.setId("e1"); // duplicate id
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.findByOwnerOrUsersContaining(user.getId())).thenReturn(Collections.emptyList());
        when(eventRepository.findByOwner(user)).thenReturn(Arrays.asList(event1));
        when(eventRepository.findByUsersContaining(user)).thenReturn(Arrays.asList(event2));
        List<EventDTO> result = eventService.getAllEvents(userEmail);
        assertEquals(1, result.size());
    }

    @Test
    void testGetEventById_UserNotFound() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        Event event = new Event();
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());
        assertThrows(EventException.class, () -> eventService.getEventById(eventId, userEmail));
    }

    @Test
    void testCreateEvent_NullUserIds() {
        CreateEventRequest request = new CreateEventRequest();
        request.setTitle("title");
        request.setUserIds(null);
        String ownerEmail = "owner@example.com";
        User owner = new User();
        owner.setId("1");
        when(userRepository.findByEmail(ownerEmail)).thenReturn(Optional.of(owner));
        when(eventRepository.save(any(Event.class))).thenAnswer(inv -> inv.getArgument(0));
        assertDoesNotThrow(() -> eventService.createEvent(request, ownerEmail));
        verify(invitationService, never()).createInvitations(any(), any(), any());
    }

    @Test
    void testCreateEvent_EmptyUserIds() {
        CreateEventRequest request = new CreateEventRequest();
        request.setTitle("title");
        request.setUserIds(Collections.emptyList());
        String ownerEmail = "owner@example.com";
        User owner = new User();
        owner.setId("1");
        when(userRepository.findByEmail(ownerEmail)).thenReturn(Optional.of(owner));
        when(eventRepository.save(any(Event.class))).thenAnswer(inv -> inv.getArgument(0));
        assertDoesNotThrow(() -> eventService.createEvent(request, ownerEmail));
        verify(invitationService, never()).createInvitations(any(), any(), any());
    }

    @Test
    void testCreateEvent_WithUserIds() {
        CreateEventRequest request = new CreateEventRequest();
        request.setTitle("title");
        request.setUserIds(Arrays.asList("2", "3"));
        String ownerEmail = "owner@example.com";
        User owner = new User();
        owner.setId("1");
        when(userRepository.findByEmail(ownerEmail)).thenReturn(Optional.of(owner));
        when(eventRepository.save(any(Event.class))).thenAnswer(inv -> inv.getArgument(0));
        eventService.createEvent(request, ownerEmail);
        verify(invitationService).createInvitations(any(), eq(Arrays.asList("2", "3")), eq(ownerEmail));
    }

    @Test
    void testUpdateEvent_AllFieldsNull() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        UpdateEventRequest request = new UpdateEventRequest();
        Event event = new Event();
        User user = new User();
        user.setId("1");
        event.setOwner(user);
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        assertDoesNotThrow(() -> eventService.updateEvent(eventId, request, userEmail));
    }

    @Test
    void testUpdateEvent_WithUserIds() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        UpdateEventRequest request = new UpdateEventRequest();
        request.setUserIds(Arrays.asList("2", "3"));
        Event event = new Event();
        User user = new User();
        user.setId("1");
        event.setOwner(user);
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        eventService.updateEvent(eventId, request, userEmail);
        verify(invitationService).createInvitations(eq(eventId), eq(Arrays.asList("2", "3")), eq(userEmail));
    }

    @Test
    void testJoinEvent_NullUsersList() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("2");
        User owner = new User();
        owner.setId("1");
        Event event = new Event();
        event.setOwner(owner);
        event.setUsers(null);
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        assertThrows(NullPointerException.class, () -> eventService.joinEvent(eventId, userEmail));
    }

    @Test
    void testJoinEvent_UsersListEmpty() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("2");
        User owner = new User();
        owner.setId("1");
        Event event = new Event();
        event.setOwner(owner);
        event.setUsers(new ArrayList<>());
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.save(any(Event.class))).thenReturn(event);
        assertDoesNotThrow(() -> eventService.joinEvent(eventId, userEmail));
    }

    @Test
    void testLeaveEvent_NullUsersList() {
        String eventId = "e1";
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("2");
        User owner = new User();
        owner.setId("1");
        Event event = new Event();
        event.setOwner(owner);
        event.setUsers(null);
        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        assertThrows(NullPointerException.class, () -> eventService.leaveEvent(eventId, userEmail));
    }

    @Test
    void testGetEventsByTag_NullTags() {
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("1");
        Event event = new Event();
        event.setTags(null);
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.findByOwnerOrUsersContaining(user.getId())).thenReturn(Collections.singletonList(event));
        List<EventDTO> result = eventService.getEventsByTag(userEmail, "work");
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetEventsByTag_EmptyTags() {
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("1");
        Event event = new Event();
        event.setTags(new ArrayList<>());
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.findByOwnerOrUsersContaining(user.getId())).thenReturn(Collections.singletonList(event));
        List<EventDTO> result = eventService.getEventsByTag(userEmail, "work");
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetEventsByPriority_NullPriority() {
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("1");
        Event event = new Event();
        event.setPriority(null);
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.findByOwnerOrUsersContaining(user.getId())).thenReturn(Collections.singletonList(event));
        List<EventDTO> result = eventService.getEventsByPriority(userEmail, "high");
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetEventsByPriority_EmptyPriority() {
        String userEmail = "user@example.com";
        User user = new User();
        user.setId("1");
        Event event = new Event();
        event.setPriority("");
        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(user));
        when(eventRepository.findByOwnerOrUsersContaining(user.getId())).thenReturn(Collections.singletonList(event));
        List<EventDTO> result = eventService.getEventsByPriority(userEmail, "high");
        assertTrue(result.isEmpty());
    }
}