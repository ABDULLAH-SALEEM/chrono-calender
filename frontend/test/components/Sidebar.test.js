import React from "react";
import { render, screen } from "@testing-library/react";
import Sidebar from "../../src/components/Sidebar";
import { AuthContext } from "../../src/context/AuthContext";

const mockAuth = {
  user: { name: "Test User" },
  isAuthenticated: true,
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn()
};

describe("Sidebar", () => {
  it("renders without crashing", () => {
    render(
      <AuthContext.Provider value={mockAuth}>
        <Sidebar selected={0} onSelect={jest.fn()} collapsed={false} />
      </AuthContext.Provider>
    );
    // Check for the app name in the sidebar
    expect(screen.getByText("Chrono")).toBeInTheDocument();
  });
});
