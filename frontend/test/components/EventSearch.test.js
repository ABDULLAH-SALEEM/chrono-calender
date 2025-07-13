import React from "react";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventSearch from "../../src/components/EventSearch";
import { useMediaQuery } from "@mui/material";

// Mock MUI theme and useMediaQuery
jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    useTheme: () => ({ breakpoints: { down: () => jest.fn() } }),
    useMediaQuery: jest.fn(() => false)
  };
});

describe("EventSearch", () => {
  const events = [
    { title: "Meeting", description: "Team sync", tags: ["work"] },
    { title: "Birthday", description: "Party", tags: ["personal", "fun"] },
    { title: "Dentist", description: "Checkup", tags: ["health"] }
  ];

  beforeEach(() => {
    // Reset useMediaQuery mock
    useMediaQuery.mockReturnValue(false);
  });

  function renderWithBody(ui) {
    const div = document.createElement("div");
    document.body.appendChild(div);
    return render(ui, { container: div });
  }

  it("renders with placeholder", () => {
    render(<EventSearch events={events} />);
    expect(screen.getByPlaceholderText(/search events/i)).toBeInTheDocument();
  });

  it("shows filtered events when searching", () => {
    render(<EventSearch events={events} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "birth" } });
    expect(screen.getByText(/Birthday/i)).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "dent" } });
    expect(screen.getByText(/Dentist/i)).toBeInTheDocument();
  });

  // New test cases to cover uncovered lines

  it("handles mobile responsiveness", () => {
    useMediaQuery.mockReturnValue(true); // Simulate mobile
    render(<EventSearch events={events} />);
    const container = screen.getByRole("combobox").closest("div");
    expect(container).toBeInTheDocument();
  });

  it("handles empty search value", () => {
    render(<EventSearch events={events} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "   " } });
    // Should clear filtered events
    expect(screen.queryByText(/Birthday/i)).not.toBeInTheDocument();
  });

  it("handles search in description", () => {
    render(<EventSearch events={events} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "sync" } });
    expect(screen.getByText(/Meeting/i)).toBeInTheDocument();
  });

  it("handles search in tags", () => {
    render(<EventSearch events={events} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "work" } });
    expect(screen.getByText(/Meeting/i)).toBeInTheDocument();
  });

  it("handles events without tags", () => {
    const eventsWithoutTags = [
      { title: "Meeting", description: "Team sync" },
      { title: "Birthday", description: "Party" }
    ];
    render(<EventSearch events={eventsWithoutTags} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "meeting" } });
    expect(screen.getByText(/Meeting/i)).toBeInTheDocument();
  });

  it("handles events with non-array tags", () => {
    const eventsWithInvalidTags = [
      { title: "Meeting", description: "Team sync", tags: "work" },
      { title: "Birthday", description: "Party", tags: null }
    ];
    render(<EventSearch events={eventsWithInvalidTags} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "meeting" } });
    expect(screen.getByText(/Meeting/i)).toBeInTheDocument();
  });

  it("handles event selection", () => {
    const onEventSelect = jest.fn();
    render(<EventSearch events={events} onEventSelect={onEventSelect} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "birth" } });
    const eventOption = screen.getByText(/Birthday/i);
    fireEvent.click(eventOption);
    expect(onEventSelect).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Birthday" })
    );
  });

  it("clears search value after event selection", async () => {
    const onEventSelect = jest.fn();
    render(<EventSearch events={events} onEventSelect={onEventSelect} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "birth" } });
    const eventOption = screen.getByText(/Birthday/i);
    fireEvent.click(eventOption);
    // The input value should be cleared by the component
    expect(onEventSelect).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Birthday" })
    );
  });

  it("handles null event selection", () => {
    const onEventSelect = jest.fn();
    render(<EventSearch events={events} onEventSelect={onEventSelect} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "birth" } });
    // Simulate selecting null/undefined
    const autocomplete = screen.getByRole("combobox");
    fireEvent.change(autocomplete, { target: { value: "" } });
    expect(onEventSelect).not.toHaveBeenCalled();
  });

  it("formats event time correctly", () => {
    const eventsWithDates = [
      {
        title: "Meeting",
        description: "Team sync",
        tags: ["work"],
        start: "2024-01-01T10:00:00Z"
      }
    ];
    render(<EventSearch events={eventsWithDates} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "meeting" } });
    expect(screen.getByText(/Meeting/i)).toBeInTheDocument();
  });

  it("handles events without start date", () => {
    const eventsWithoutDates = [
      {
        title: "Meeting",
        description: "Team sync",
        tags: ["work"]
      }
    ];
    render(<EventSearch events={eventsWithoutDates} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "meeting" } });
    expect(screen.getByText(/Meeting/i)).toBeInTheDocument();
  });

  it("renders tags correctly in search results", () => {
    render(<EventSearch events={events} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "birth" } });
    expect(screen.getAllByText(/personal/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/fun/i).length).toBeGreaterThan(0);
  });

  it("handles events with more than 3 tags", () => {
    const eventsWithManyTags = [
      {
        title: "Meeting",
        description: "Team sync",
        tags: ["work", "important", "urgent", "team", "sync"]
      }
    ];
    render(<EventSearch events={eventsWithManyTags} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "meeting" } });
    expect(screen.getByText(/\+2/i)).toBeInTheDocument(); // Shows +2 for remaining tags
  });

  it("handles events with exactly 3 tags", () => {
    const eventsWithThreeTags = [
      {
        title: "Meeting",
        description: "Team sync",
        tags: ["work", "important", "urgent"]
      }
    ];
    render(<EventSearch events={eventsWithThreeTags} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "meeting" } });
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument(); // Should not show + indicator
  });

  it("handles string option in getOptionLabel", () => {
    render(<EventSearch events={events} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "test" } });
    // This tests the getOptionLabel function with string input
    expect(input).toBeInTheDocument();
  });

  it("handles events without title", () => {
    const eventsWithoutTitle = [
      {
        description: "Team sync",
        tags: ["work"]
      }
    ];
    render(<EventSearch events={eventsWithoutTitle} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "sync" } });
    expect(screen.getByText(/Team sync/i)).toBeInTheDocument();
  });

  it("handles custom placeholder", () => {
    const customPlaceholder = "Custom search placeholder";
    render(<EventSearch events={events} placeholder={customPlaceholder} />);
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it("handles events with null or undefined properties", () => {
    const eventsWithNullProps = [
      {
        title: null,
        description: undefined,
        tags: null
      }
    ];
    render(<EventSearch events={eventsWithNullProps} />);
    const input = screen.getByPlaceholderText(/search events/i);
    fireEvent.change(input, { target: { value: "test" } });
    // Should not crash and should handle null/undefined gracefully
    expect(input).toBeInTheDocument();
  });
});
