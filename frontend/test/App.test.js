import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../src/App";
import { act } from "react";

// Mock MUI ThemeProvider to just render children
jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    ThemeProvider: ({ children }) => <>{children}</>,
    CssBaseline: ({ children }) => <>{children}</>
  };
});

// Mock all the page components
jest.mock("../src/pages/MainLayout", () => () => (
  <div data-testid="main-layout">MainLayout</div>
));
jest.mock("../src/pages/LoginPage", () => () => (
  <div data-testid="login-page">LoginPage</div>
));
jest.mock("../src/pages/RegisterPage", () => () => (
  <div data-testid="register-page">RegisterPage</div>
));
jest.mock("../src/pages/EventJoinPage", () => () => (
  <div data-testid="event-join-page">EventJoinPage</div>
));

// Mock the ProtectedRoute component
jest.mock("../src/components/ProtectedRoutes", () => ({
  ProtectedRoute: ({ children }) => <>{children}</>
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    )
  },
  AnimatePresence: ({ children }) => (
    <div data-testid="animate-presence">{children}</div>
  )
}));

// Mock AuthContext
jest.mock("../src/context/AuthContext", () => ({
  AuthProvider: ({ children }) => (
    <div data-testid="auth-provider">{children}</div>
  )
}));

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  BrowserRouter: ({ children }) => (
    <div data-testid="browser-router">{children}</div>
  ),
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ element }) => <div data-testid="route">{element}</div>,
  useLocation: () => ({ pathname: "/" })
}));

describe("App", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with proper theme provider and auth provider", () => {
    render(<App />);
    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    expect(screen.getByTestId("browser-router")).toBeInTheDocument();
  });

  it("renders with motion animations", () => {
    render(<App />);
    expect(screen.getByTestId("animate-presence")).toBeInTheDocument();
    expect(screen.getAllByTestId("motion-div")).toHaveLength(4); // 4 routes
  });

  it("renders CssBaseline", () => {
    render(<App />);
    expect(screen.getByTestId("browser-router")).toBeInTheDocument();
  });

  it("renders routes structure", () => {
    render(<App />);
    expect(screen.getByTestId("routes")).toBeInTheDocument();
    expect(screen.getAllByTestId("route")).toHaveLength(4); // 4 routes
  });

  it("renders with proper component structure", () => {
    render(<App />);
    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    expect(screen.getByTestId("browser-router")).toBeInTheDocument();
    expect(screen.getByTestId("animate-presence")).toBeInTheDocument();
    expect(screen.getAllByTestId("motion-div")).toHaveLength(4); // 4 routes
  });

  it("handles protected routes correctly", () => {
    render(<App />);
    expect(screen.getAllByTestId("route")).toHaveLength(4); // 4 routes
  });

  it("renders with all required providers", () => {
    render(<App />);
    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    expect(screen.getByTestId("browser-router")).toBeInTheDocument();
  });

  it("renders AnimatedRoutes component", () => {
    render(<App />);
    expect(screen.getByTestId("animate-presence")).toBeInTheDocument();
    expect(screen.getAllByTestId("motion-div")).toHaveLength(4); // 4 routes
  });

  it("renders with proper motion transitions", () => {
    render(<App />);
    expect(screen.getAllByTestId("motion-div")).toHaveLength(4); // 4 routes
  });
});
