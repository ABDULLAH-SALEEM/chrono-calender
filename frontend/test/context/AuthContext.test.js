import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider, AuthContext } from "../../src/context/AuthContext";

jest.mock("../../src/services/apis", () => ({
  authService: {
    login: jest.fn(() =>
      Promise.resolve({ data: { token: "token", user: { name: "Test" } } })
    ),
    register: jest.fn(() =>
      Promise.resolve({ data: { token: "token", user: { name: "Test" } } })
    ),
    getCurrentUser: jest.fn(() => Promise.resolve({ data: { name: "Test" } }))
  }
}));

describe("AuthProvider", () => {
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
});
