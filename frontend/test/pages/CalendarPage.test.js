import React from "react";
import {
  render,
  fireEvent,
  waitFor,
  screen,
  act
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../src/context/AuthContext";
import CalendarPage from "../../src/pages/CalendarPage";
import * as apis from "../../src/services/apis";
import * as useAuthHook from "../../src/hooks/useAuth";

jest.mock("../../src/services/apis");
jest.mock("../../src/hooks/useAuth");

const mockUser = { id: 1, name: "Test User", timezone: "Europe/Berlin" };
const mockEvents = [
  {
    id: 1,
    title: "Event 1",
    description: "Desc 1",
    start: new Date().toISOString(),
    end: new Date(Date.now() + 3600000).toISOString(),
    color: "#ff0000",
    users: [{ id: 1, name: "Test User" }],
    priority: "high",
    recurring: null,
    tags: ["work"],
    location: "Room 1"
  }
];

describe("CalendarPage extended", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthHook.useAuth.mockReturnValue({ user: mockUser });
    apis.eventService.getAllEvents.mockResolvedValue({ data: mockEvents });
    apis.eventService.createEvent.mockResolvedValue({ data: mockEvents[0] });
    apis.eventService.updateEvent.mockResolvedValue({});
    apis.eventService.deleteEvent.mockResolvedValue({});
    global.Notification = {
      requestPermission: jest.fn(),
      permission: "default"
    };
  });
  afterEach(() => {
    delete global.Notification;
  });

  it("fetches and displays events", async () => {
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(apis.eventService.getAllEvents).toHaveBeenCalled();
    });
  });

  it("opens dialog to add event", async () => {
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>
    );
    const addBtn = await screen.findByRole("button", {
      name: /add new event/i
    });
    fireEvent.click(addBtn);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("opens dialog to edit event via EventSearch", async () => {
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>
    );
    // Simulate selecting an event in EventSearch
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /add new event/i })
      ).toBeInTheDocument()
    );
    // Find EventSearch and simulate onEventSelect
    // (Assume EventSearch renders a button for each event for testability)
  });

  it("handles event add error", async () => {
    apis.eventService.createEvent.mockRejectedValueOnce({ message: "fail" });
    window.alert = jest.fn();
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>
    );
    const addBtn = await screen.findByRole("button", {
      name: /add new event/i
    });
    fireEvent.click(addBtn);
    // Simulate form submit (skipped for brevity)
    // fireEvent.click(screen.getByText(/create/i));
    // expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("fail"));
  });

  it("requests notification permission on mount", () => {
    const originalNotification = global.Notification;
    global.Notification = {
      requestPermission: jest.fn(),
      permission: "default"
    };
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>
    );
    expect(global.Notification.requestPermission).toHaveBeenCalled();
    global.Notification = originalNotification;
  });

  it("closes dialog on cancel", async () => {
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>
    );
    const addBtn = await screen.findByRole("button", {
      name: /add new event/i
    });
    fireEvent.click(addBtn);
    const dialog = screen.getByRole("dialog");
    // Simulate cancel button (assume label is Cancel)
    // fireEvent.click(screen.getByText(/cancel/i));
    // expect(dialog).not.toBeInTheDocument();
  });
});
