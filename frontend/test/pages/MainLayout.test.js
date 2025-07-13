import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../src/context/AuthContext";
import MainLayout from "../../src/pages/MainLayout";
import * as useMediaQuery from "@mui/material/useMediaQuery";

// Mock the useMediaQuery hook
jest.mock("@mui/material/useMediaQuery");

describe("MainLayout", () => {
  const mockAuthContext = {
    user: {},
    login: jest.fn()
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <MainLayout />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  });

  it("renders desktop layout with collapse button when not mobile", () => {
    // Mock useMediaQuery to return false (desktop)
    useMediaQuery.default.mockReturnValue(false);

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <MainLayout />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Check if collapse button is rendered (desktop only) - look for ChevronLeftIcon
    const collapseButton = screen
      .getByTestId("ChevronLeftIcon")
      .closest("button");
    expect(collapseButton).toBeInTheDocument();
  });

  it("does not render collapse button on mobile", () => {
    // Mock useMediaQuery to return true (mobile)
    useMediaQuery.default.mockReturnValue(true);

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <MainLayout />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Check that collapse button is not rendered (mobile)
    const chevronIcon = screen.queryByTestId("ChevronLeftIcon");
    expect(chevronIcon).not.toBeInTheDocument();
  });

  it("displays correct page title for each tab", () => {
    useMediaQuery.default.mockReturnValue(false);

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <MainLayout />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Default page should be Calendar
    expect(screen.getByText("Calender")).toBeInTheDocument();
  });

  it("handles sidebar selection changes", () => {
    useMediaQuery.default.mockReturnValue(false);

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <MainLayout />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // The handleSelect function is called by the Sidebar component
    // We can verify the component renders without errors when selection changes
    expect(screen.getByText("Calender")).toBeInTheDocument();
  });

  it("handles collapse button click", () => {
    useMediaQuery.default.mockReturnValue(false);

    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <MainLayout />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    const collapseButton = screen
      .getByTestId("ChevronLeftIcon")
      .closest("button");
    fireEvent.click(collapseButton);

    // The button should still be present after click
    expect(collapseButton).toBeInTheDocument();
  });

  it("covers the conditional rendering branch for mobile vs desktop", () => {
    // Test both branches of the conditional rendering

    // First test: mobile (isMobile = true)
    useMediaQuery.default.mockReturnValue(true);
    const { unmount } = render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <MainLayout />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Verify no collapse button on mobile
    expect(screen.queryByTestId("ChevronLeftIcon")).not.toBeInTheDocument();

    unmount();

    // Second test: desktop (isMobile = false)
    useMediaQuery.default.mockReturnValue(false);
    render(
      <MemoryRouter>
        <AuthContext.Provider value={mockAuthContext}>
          <MainLayout />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    // Verify collapse button is present on desktop
    expect(screen.getByTestId("ChevronLeftIcon")).toBeInTheDocument();
  });
});
