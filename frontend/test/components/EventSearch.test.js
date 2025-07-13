import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import EventSearch from "../../src/components/EventSearch";

// Mock MUI theme and useMediaQuery
jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    useTheme: () => ({ breakpoints: { down: () => jest.fn() } }),
    useMediaQuery: () => false
  };
});

describe("EventSearch", () => {
  const events = [
    { title: "Meeting", description: "Team sync", tags: ["work"] },
    { title: "Birthday", description: "Party", tags: ["personal", "fun"] },
    { title: "Dentist", description: "Checkup", tags: ["health"] }
  ];

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
});
