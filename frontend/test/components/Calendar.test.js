import React from "react";
import { render, screen } from "@testing-library/react";
import Calendar from "../../src/components/Calendar";

describe("Calendar", () => {
  it("renders without crashing", () => {
    render(<Calendar />);
    expect(screen.getByText(/Calendar Component/i)).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<Calendar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
