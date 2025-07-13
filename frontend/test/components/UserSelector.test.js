import React from "react";
import { render, screen } from "@testing-library/react";
import UserSelector from "../../src/components/UserSelector";

describe("UserSelector", () => {
  it("renders without crashing", () => {
    render(<UserSelector value={[]} onChange={() => {}} />);
    expect(screen.getByTestId("user-selector-root")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <UserSelector value={[]} onChange={() => {}} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
