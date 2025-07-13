import React from "react";
import { render, screen } from "@testing-library/react";
import ProfilePage from "../../src/pages/ProfilePage";

describe("ProfilePage", () => {
  it("renders without crashing", () => {
    render(<ProfilePage />);
    expect(screen.getByText(/Profile Page/i)).toBeInTheDocument();
  });
});
