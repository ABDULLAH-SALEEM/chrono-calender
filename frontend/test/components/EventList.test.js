import React from "react";
import { render, screen } from "@testing-library/react";
import EventList from "../../src/components/EventList";

describe("EventList", () => {
  it("renders without crashing", () => {
    render(<EventList />);
    expect(screen.getByText(/Event List Component/i)).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<EventList />);
    expect(asFragment()).toMatchSnapshot();
  });
});
