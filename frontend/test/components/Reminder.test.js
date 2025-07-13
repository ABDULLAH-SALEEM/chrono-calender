import React from "react";
import { render, screen } from "@testing-library/react";
import Reminder from "../../src/components/Reminder";

describe("Reminder", () => {
  it("renders without crashing", () => {
    render(<Reminder />);
    expect(screen.getByTestId("reminder-root")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<Reminder />);
    expect(asFragment()).toMatchSnapshot();
  });
});
