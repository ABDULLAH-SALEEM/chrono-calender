import React from "react";
import { render, screen } from "@testing-library/react";
import Sidebar from "../../src/components/Sidebar";
import { AuthContext } from "../../src/context/AuthContext";

describe("Sidebar", () => {
  const mockAuth = { logout: jest.fn() };
  it("renders without crashing", () => {
    render(
      <AuthContext.Provider value={mockAuth}>
        <Sidebar />
      </AuthContext.Provider>
    );
    expect(screen.getByTestId("sidebar-root")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <AuthContext.Provider value={mockAuth}>
        <Sidebar />
      </AuthContext.Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
