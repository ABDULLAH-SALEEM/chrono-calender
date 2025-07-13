import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../src/context/AuthContext";
import EventJoinPage from "../../src/pages/EventJoinPage";
import { fireEvent, waitFor, screen, act } from "@testing-library/react";
import * as apis from "../../src/services/apis";
import * as router from "react-router-dom";

jest.mock("../../src/services/apis");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
  useNavigate: jest.fn()
}));

describe("EventJoinPage extended", () => {
  const mockEvent = {
    id: 1,
    title: "Test Event",
    description: "Test Desc",
    start: new Date().toISOString(),
    end: new Date(Date.now() + 3600000).toISOString(),
    location: "Room 1",
    priority: "high",
    tags: ["work"],
    owner: { name: "Owner" }
  };
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    router.useParams.mockReturnValue({ eventId: 1 });
    router.useNavigate.mockReturnValue(mockNavigate);
    apis.eventService.getEvent.mockResolvedValue({ data: mockEvent });
    apis.eventService.joinEvent.mockResolvedValue({});
  });

  it("shows loading spinner initially", () => {
    apis.eventService.getEvent.mockReturnValue(new Promise(() => {}));
    render(<EventJoinPage />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders event details after loading", async () => {
    render(<EventJoinPage />);
    expect(await screen.findByText(/test event/i)).toBeInTheDocument();
    expect(screen.getByText(/test desc/i)).toBeInTheDocument();
    expect(screen.getByText(/owner/i)).toBeInTheDocument();
  });

  it("handles error state if event fetch fails", async () => {
    apis.eventService.getEvent.mockRejectedValueOnce({});
    render(<EventJoinPage />);
    expect(
      await screen.findByText(/failed to load event/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /go to calendar/i })
    ).toBeInTheDocument();
  });

  it("handles join event success and redirects", async () => {
    jest.useFakeTimers();
    render(<EventJoinPage />);
    await screen.findByText(/test event/i);
    fireEvent.click(screen.getByRole("button", { name: /join event/i }));
    expect(await screen.findByText(/successfully joined/i)).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    expect(mockNavigate).toHaveBeenCalledWith("/");
    jest.useRealTimers();
  });

  it("handles join event error", async () => {
    apis.eventService.joinEvent.mockRejectedValueOnce({
      response: { data: { message: "fail" } }
    });
    render(<EventJoinPage />);
    await screen.findByText(/test event/i);
    fireEvent.click(screen.getByRole("button", { name: /join event/i }));
    expect(await screen.findByText(/fail/i)).toBeInTheDocument();
  });

  it("handles cancel button", async () => {
    render(<EventJoinPage />);
    await screen.findByText(/test event/i);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
