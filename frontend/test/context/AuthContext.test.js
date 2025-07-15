import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, AuthContext } from "../../src/context/AuthContext";
import * as apis from "../../src/services/apis";
import { act } from "react";

jest.mock("../../src/services/apis", () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    getCurrentUser: jest.fn()
  }
}));

describe("AuthProvider", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders children", async () => {
    render(
      <AuthProvider>
        <div>Child</div>
      </AuthProvider>
    );
    await waitFor(() => expect(screen.getByText("Child")).toBeInTheDocument());
  });

  it("provides login and logout", async () => {
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    await contextValue.login({ email: "a", password: "b" });
    expect(contextValue.user).toBeDefined();
    contextValue.logout();
    expect(contextValue.user).toBeNull();
  });

  it("provides register", async () => {
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    await contextValue.register({ email: "a", password: "b" });
    expect(contextValue.user).toBeDefined();
  });

  // New test cases to cover uncovered lines

  it("handles login error gracefully", async () => {
    apis.authService.login.mockRejectedValue(new Error("Login failed"));
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    const result = await contextValue.login({ email: "a", password: "b" });
    expect(result).toBe(false);
    expect(contextValue.user).toBeNull();
    expect(contextValue.isAuthenticated).toBe(false);
  });

  it("handles register error gracefully", async () => {
    apis.authService.register.mockRejectedValue(
      new Error("Registration failed")
    );
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    const result = await contextValue.register({ email: "a", password: "b" });
    expect(result).toBe(false);
    expect(contextValue.user).toBeNull();
    expect(contextValue.isAuthenticated).toBe(false);
  });

  it("validates token on mount when token exists", async () => {
    localStorage.setItem("token", "valid-token");
    apis.authService.getCurrentUser.mockResolvedValue({
      data: { id: "1", name: "Test User" }
    });
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => {
      expect(contextValue.user).toEqual({ id: "1", name: "Test User" });
      expect(contextValue.isAuthenticated).toBe(true);
    });
  });

  it("handles invalid token on mount", async () => {
    localStorage.setItem("token", "invalid-token");
    apis.authService.getCurrentUser.mockRejectedValue(
      new Error("Invalid token")
    );
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => {
      expect(contextValue.user).toBeNull();
      expect(contextValue.isAuthenticated).toBe(false);
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  it("handles no token on mount", async () => {
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => {
      expect(contextValue.user).toBeNull();
      expect(contextValue.isAuthenticated).toBe(false);
      expect(contextValue.loading).toBe(false);
    });
  });

  it("stores token in localStorage on successful login", async () => {
    apis.authService.login.mockResolvedValue({
      data: { token: "token", user: { name: "Test" } }
    });
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    await contextValue.login({ email: "a", password: "b" });
    expect(localStorage.getItem("token")).toBe("token");
  });

  it("stores token in localStorage on successful register", async () => {
    apis.authService.register.mockResolvedValue({
      data: { token: "token", user: { name: "Test" } }
    });
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    await contextValue.register({ email: "a", password: "b" });
    expect(localStorage.getItem("token")).toBe("token");
  });

  it("removes token from localStorage on logout", async () => {
    localStorage.setItem("token", "test-token");
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    contextValue.logout();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("sets loading state correctly during token validation", async () => {
    localStorage.setItem("token", "valid-token");
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    apis.authService.getCurrentUser.mockReturnValue(promise);
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    // Should be loading initially
    expect(contextValue.loading).toBe(true);
    resolvePromise({ data: { id: "1", name: "Test User" } });
    await waitFor(() => {
      expect(contextValue.loading).toBe(false);
    });
  });

  it("sets loading state correctly when no token exists", async () => {
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => {
      expect(contextValue.loading).toBe(false);
    });
  });

  it("handles getCurrentUser error during token validation", async () => {
    localStorage.setItem("token", "invalid-token");
    apis.authService.getCurrentUser.mockRejectedValue(
      new Error("Network error")
    );
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => {
      expect(contextValue.user).toBeNull();
      expect(contextValue.isAuthenticated).toBe(false);
      expect(contextValue.loading).toBe(false);
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  it("handles successful login with user data", async () => {
    const mockUser = { id: "1", name: "Test User", email: "test@example.com" };
    apis.authService.login.mockResolvedValue({
      data: { token: "new-token", user: mockUser }
    });
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    const result = await contextValue.login({ email: "a", password: "b" });
    expect(result).toBe(true);
    expect(contextValue.user).toEqual(mockUser);
    expect(contextValue.isAuthenticated).toBe(true);
    expect(localStorage.getItem("token")).toBe("new-token");
  });

  it("handles successful register with user data", async () => {
    const mockUser = { id: "1", name: "Test User", email: "test@example.com" };
    apis.authService.register.mockResolvedValue({
      data: { token: "new-token", user: mockUser }
    });
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    const result = await contextValue.register({ email: "a", password: "b" });
    expect(result).toBe(true);
    expect(contextValue.user).toEqual(mockUser);
    expect(contextValue.isAuthenticated).toBe(true);
    expect(localStorage.getItem("token")).toBe("new-token");
  });

  it("handles login with missing user data", async () => {
    apis.authService.login.mockResolvedValue({
      data: { token: "new-token", user: null } // No user data
    });
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    const result = await contextValue.login({ email: "a", password: "b" });
    expect(result).toBe(true);
    expect(contextValue.user).toBeNull();
    expect(contextValue.isAuthenticated).toBe(true);
  });

  it("handles register with missing user data", async () => {
    apis.authService.register.mockResolvedValue({
      data: { token: "new-token", user: null } // No user data
    });
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    const result = await contextValue.register({ email: "a", password: "b" });
    expect(result).toBe(true);
    expect(contextValue.user).toBeNull();
    expect(contextValue.isAuthenticated).toBe(true);
  });

  it("handles login with missing token", async () => {
    apis.authService.login.mockResolvedValue({
      data: { user: { name: "Test" } } // No token
    });
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    const result = await contextValue.login({ email: "a", password: "b" });
    expect(result).toBe(true);
    expect(contextValue.user).toEqual({ name: "Test" });
    expect(contextValue.isAuthenticated).toBe(true);
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("handles register with missing token", async () => {
    apis.authService.register.mockResolvedValue({
      data: { user: { name: "Test" } } // No token
    });
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    const result = await contextValue.register({ email: "a", password: "b" });
    expect(result).toBe(true);
    expect(contextValue.user).toEqual({ name: "Test" });
    expect(contextValue.isAuthenticated).toBe(true);
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("handles empty response from login", async () => {
    apis.authService.login.mockResolvedValue({
      data: { token: "token", user: null }
    });
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    const result = await contextValue.login({ email: "a", password: "b" });
    expect(result).toBe(true);
    expect(contextValue.user).toBeNull();
    expect(contextValue.isAuthenticated).toBe(true);
  });

  it("handles empty response from register", async () => {
    apis.authService.register.mockResolvedValue({
      data: { token: "token", user: null }
    });
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    const result = await contextValue.register({ email: "a", password: "b" });
    expect(result).toBe(true);
    expect(contextValue.user).toBeNull();
    expect(contextValue.isAuthenticated).toBe(true);
  });

  it("handles null response from login", async () => {
    apis.authService.login.mockResolvedValue(null);
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    const result = await contextValue.login({ email: "a", password: "b" });
    expect(result).toBe(false);
    expect(contextValue.user).toBeNull();
    expect(contextValue.isAuthenticated).toBe(false);
  });

  it("handles null response from register", async () => {
    apis.authService.register.mockResolvedValue(null);
    let contextValue;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            contextValue = value;
            return <div>Test</div>;
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );
    await waitFor(() => expect(contextValue).toBeDefined());
    const result = await contextValue.register({ email: "a", password: "b" });
    expect(result).toBe(false);
    expect(contextValue.user).toBeNull();
    expect(contextValue.isAuthenticated).toBe(false);
  });
});
