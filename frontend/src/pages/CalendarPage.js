import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { createDragAndDropPlugin } from "@schedule-x/drag-and-drop";
import "@schedule-x/theme-shadcn/dist/index.css";
import Dialog from "@mui/material/Dialog";
import EventForm from "../components/EventForm";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Button from "@mui/material/Button";

const CalendarPage = () => {
  const eventsService = useState(() => createEventsServicePlugin())[0];
  const dragAndDropPlugin = useState(() => createDragAndDropPlugin())[0];
  const initialEvents = [
    {
      id: "1",
      title: "Team Meeting",
      start: "2025-07-10 09:00",
      end: "2025-07-10 10:00",
      description:
        "Weekly team sync meeting to discuss project progress and upcoming milestones",
      color: "#667eea",
      people: ["Abdullah", "Ali"],
    },
    {
      id: "2",
      title: "All Day Hackathon",
      start: "2025-07-11 07:00",
      end: "2025-07-11 11:00",
      description: "A full day of coding and fun!",
    },
    {
      id: "3",
      title: "Lunch with Sarah",
      start: "2025-07-12 12:00",
      end: "2025-07-12 13:00",
      description: "Catch up over lunch at the new restaurant downtown",
    },
    {
      id: "4",
      title: "Code Review",
      start: "2025-07-15 14:00",
      end: "2025-07-15 15:00",
      description:
        "Review pull requests and provide feedback to the development team",
    },
    {
      id: "5",
      title: "Product Planning",
      start: "2025-07-16",
      end: "2025-07-16",
      description:
        "Strategic planning session for Q2 product roadmap and feature prioritization",
    },
  ];

  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState(initialEvents);
  const [editEvent, setEditEvent] = useState(null);

  const handleAddEvent = (data) => {
    const newEvent = {
      ...data,
      id: (events.length + 1).toString(),
      start:
        data.start instanceof Date
          ? data.start.toISOString().slice(0, 16).replace("T", " ")
          : data.start,
      end:
        data.end instanceof Date
          ? data.end.toISOString().slice(0, 16).replace("T", " ")
          : data.end,
    };
    setEvents((prev) => [...prev, newEvent]);
    calendar.events.add(newEvent);
    setOpen(false);
  };

  const handleUpdateEvent = (data) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === editEvent.id
          ? { ...ev, ...data, start: data.start, end: data.end }
          : ev
      )
    );
    calendar.events.update({ ...editEvent, ...data });
    setOpen(false);
    setEditEvent(null);
  };

  const handleDeleteEvent = () => {
    if (!editEvent) return;
    setEvents((prev) => prev.filter((ev) => ev.id !== editEvent.id));
    calendar.events.remove(editEvent.id);
    setOpen(false);
    setEditEvent(null);
  };

  const calendar = useCalendarApp({
    theme: "shadcn",
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    defaultView: "week",
    events: events,
    plugins: [eventsService, dragAndDropPlugin],
    eventDisplay: "block",
    callbacks: {
      onEventUpdate: (event) => {
        // Called after drag & drop or resize
        eventsService.update(event);
      },
      onEventClick: (event, e) => {
        setEditEvent({
          ...event,
          start: event.start ? new Date(event.start) : null,
          end: event.end ? new Date(event.end) : null,
        });
        setOpen(true);
      },
      // Add more callbacks as needed
    },
  });

  useEffect(() => {
    // Optionally fetch events from backend

    eventsService.getAll();
  }, [eventsService]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
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
        />
      </Dialog>
      <ScheduleXCalendar calendarApp={calendar} />
    </LocalizationProvider>
  );
};

export default CalendarPage;
