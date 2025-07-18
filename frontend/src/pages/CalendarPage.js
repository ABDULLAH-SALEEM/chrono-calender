import React, { useEffect, useState, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createEventRecurrencePlugin } from "@schedule-x/event-recurrence";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";

import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import "@schedule-x/theme-shadcn/dist/index.css";
import Dialog from "@mui/material/Dialog";
import EventForm from "../components/EventForm";
import EventSearch from "../components/EventSearch";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";
import { eventService } from "../services/apis";
import { useAuth } from "../hooks/useAuth";

function toLocalISOString(date) {
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0") +
    "T" +
    String(date.getHours()).padStart(2, "0") +
    ":" +
    String(date.getMinutes()).padStart(2, "0") +
    ":" +
    String(date.getSeconds()).padStart(2, "0")
  );
}

const eventsService = createEventsServicePlugin();
const calenderControls = createCalendarControlsPlugin();
const dragAndDropPlugin = createDragAndDropPlugin();

const CalendarPage = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const notifiedEventsRef = useRef(new Set());

  // formatDate moved inside fetchEvents
  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Poll for upcoming events every minute
  useEffect(() => {
    const pollInterval = setInterval(() => {
      if (!eventsService.getAll) return;
      const now = new Date();
      const tenMinsLater = new Date(now.getTime() + 10 * 60 * 1000);
      const events = eventsService.getAll();
      if (!Array.isArray(events)) return;
      events.forEach((event) => {
        if (!event.start || !event.id) return;
        const eventStart = new Date(event.start);
        if (
          eventStart.getHours() === tenMinsLater.getHours() &&
          eventStart.getMinutes() === tenMinsLater.getMinutes() &&
          !notifiedEventsRef.current.has(event.id)
        ) {
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification(`Upcoming Event: ${event.title}`, {
              body: `Starts at ${eventStart.toLocaleTimeString()}`
            });
            notifiedEventsRef.current.add(event.id);
          }
        }
      });
    }, 60 * 1000); // every minute
    return () => clearInterval(pollInterval);
  }, []);

  const fetchEvents = useCallback(async () => {
    const formatDate = (date) => {
      const d = new Date(date);
      const timeZone = user?.timezone || "Europe/Berlin";
      const options = {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      };

      const formatter = new Intl.DateTimeFormat("en-GB", options);
      const parts = formatter.formatToParts(d);

      const get = (type) => parts.find((p) => p.type === type)?.value;

      const year = get("year");
      const month = get("month");
      const day = get("day");
      const hour = get("hour");
      const minute = get("minute");

      return `${year}-${month}-${day} ${hour}:${minute}`;
    };
    try {
      const response = await eventService.getAllEvents();
      const backendEvents = response.data;
      // Build dynamic calendars config based on unique colors
      const colorToCalendarId = {};
      const dynamicCalendars = {};
      backendEvents.forEach((ev) => {
        if (ev.color) {
          const calendarId = `color-${ev.color.replace("#", "")}`;
          colorToCalendarId[ev.color] = calendarId;
          if (!dynamicCalendars[calendarId]) {
            dynamicCalendars[calendarId] = {
              colorName: calendarId,
              lightColors: {
                main: ev.color,
                container: ev.color + "95", // add some transparency
                onContainer: "#000000"
              },
              darkColors: {
                main: ev.color,
                container: ev.color + "40",
                onContainer: "#ffffff"
              }
            };
          }
        }
      });

      const formattedEvents = backendEvents.map((ev) => ({
        ...ev,
        id: ev.id,
        title: ev.title,
        description: ev.description,
        start: formatDate(ev.start),
        end: formatDate(ev.end),
        color: ev.color || "#667eea",
        people: ev.users ? ev.users.map((u) => u.name) : [],
        priority: ev.priority,
        recurring: ev.recurring,
        tags: ev.tags,
        location: ev?.location || "",
        userIds: ev?.users || [],
        calendarId: ev.color ? colorToCalendarId[ev.color] : "personal",
        ...(ev.recurring
          ? {
              rrule:
                ev.recurring === "daily"
                  ? "FREQ=DAILY;"
                  : ev.recurring === "weekly"
                    ? "FREQ=WEEKLY;"
                    : ev.recurring === "monthly"
                      ? "FREQ=MONTHLY;"
                      : ""
            }
          : {})
      }));
      eventsService.set(formattedEvents);
      setAllEvents(formattedEvents);
      calenderControls.setCalendars(dynamicCalendars);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  }, [user]);

  const handleAddEvent = async (data) => {
    try {
      const newEvent = {
        ...data,
        start: toLocalISOString(data.start),
        end: toLocalISOString(data.end)
      };
      const response = await eventService.createEvent(newEvent);
      const createdEvent = response.data;
      console.log(createdEvent);
      await fetchEvents();
      setOpen(false);
    } catch (error) {
      alert(
        "Failed to add event: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleUpdateEvent = async (data) => {
    try {
      await eventService.updateEvent(editEvent.id, {
        ...data,
        start: toLocalISOString(data.start),
        end: toLocalISOString(data.end)
      });
      await fetchEvents();
      setOpen(false);
      setEditEvent(null);
    } catch (error) {
      alert(
        "Failed to update event: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDeleteEvent = async () => {
    if (!editEvent) return;
    try {
      await eventService.deleteEvent(editEvent.id);
      // Refresh the events list instead of manually removing
      await fetchEvents();
      setOpen(false);
      setEditEvent(null);
    } catch (error) {
      alert(
        "Failed to delete event: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleEventSelect = (selectedEvent) => {
    setEditEvent({
      ...selectedEvent,
      start: selectedEvent.start ? new Date(selectedEvent.start) : null,
      end: selectedEvent.end ? new Date(selectedEvent.end) : null
    });
    setOpen(true);
  };

  const calendar = useCalendarApp({
    theme: "shadcn",
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda()
    ],
    defaultView: "week",
    events: allEvents,
    plugins: [
      eventsService,
      dragAndDropPlugin,
      createEventRecurrencePlugin(),
      calenderControls
    ],
    eventDisplay: "block",
    callbacks: {
      onEventUpdate: async (event, _e) => {
        try {
          const data = {
            ...event,
            start: toLocalISOString(new Date(event.start)),
            end: toLocalISOString(new Date(event.end)),
            userIds: event.userIds.map((user) => user.id)
          };
          await eventService.updateEvent(event.id, data);
        } catch (error) {
          console.log("erororor", error);
        }
      },
      onEventClick: (event, _e) => {
        setEditEvent({
          ...event,
          start: event.start ? new Date(event.start) : null,
          end: event.end ? new Date(event.end) : null
        });
        setOpen(true);
      }
      // Add more callbacks as needed
    }
  });

  // Fetch events from backend on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        data-testid="calendar-page"
        display={"flex"}
        gap={2}
        justifyContent={"flex-end"}
        mt={-5}
        mb={2}
        flexWrap={"wrap"}
      >
        <EventSearch
          events={allEvents}
          onEventSelect={handleEventSelect}
          placeholder="Search events by title, description, or tags..."
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditEvent(null);
            setOpen(true);
          }}
        >
          Add New Event
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setEditEvent(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <EventForm
          initialValues={editEvent || {}}
          onSubmit={editEvent ? handleUpdateEvent : handleAddEvent}
          onCancel={() => {
            setOpen(false);
            setEditEvent(null);
          }}
          submitLabel={editEvent ? "Update" : "Create"}
          onDelete={editEvent ? handleDeleteEvent : undefined}
          eventId={editEvent?.id}
        />
      </Dialog>
      <ScheduleXCalendar calendarApp={calendar} />
    </LocalizationProvider>
  );
};

export default CalendarPage;
