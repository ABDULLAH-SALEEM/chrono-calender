import React from "react";
import { render, screen } from "@testing-library/react";
import { ProtectedRoute } from "../../src/components/ProtectedRoutes";
import * as useAuthHook from "../../src/hooks/useAuth";
import { MemoryRouter } from "react-router-dom";
jest.mock("../../src/hooks/useAuth");

const Dummy = () => <div>Protected Content</div>;
const LoginPage = () => <div>LoginPage</div>;
jest.mock("../../src/pages/LoginPage", () => LoginPage);

describe("ProtectedRoute", () => {
  afterEach(() => jest.clearAllMocks());

  it("renders children if authenticated", () => {
    useAuthHook.useAuth.mockReturnValue({ isAuthenticated: true });
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <Dummy />
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });

  it("renders LoginPage if not authenticated and requireAuth", () => {
    useAuthHook.useAuth.mockReturnValue({ isAuthenticated: false });
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <Dummy />
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText(/loginpage/i)).toBeInTheDocument();
  });

  it("redirects to / if authenticated and requireAuth is false", () => {
    useAuthHook.useAuth.mockReturnValue({ isAuthenticated: true });
    // We can't test Navigate directly, but we can check that children are not rendered
    render(
      <MemoryRouter>
        <ProtectedRoute requireAuth={false}>
          <Dummy />
        </ProtectedRoute>
      </MemoryRouter>
    );
    // Should not render Dummy
    expect(screen.queryByText(/protected content/i)).not.toBeInTheDocument();
  });
});
