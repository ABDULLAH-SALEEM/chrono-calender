import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
jest.mock("./pages/MainLayout", () => () => <div>MainLayout</div>);
jest.mock("./pages/LoginPage", () => () => <div>LoginPage</div>);
jest.mock("./pages/RegisterPage", () => () => <div>RegisterPage</div>);
jest.mock("./pages/EventJoinPage", () => () => <div>EventJoinPage</div>);
jest.mock("./components/ProtectedRoutes", () => ({
  ProtectedRoute: ({ children }) => <>{children}</>
}));

describe("App", () => {
  it("renders MainLayout for /", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/MainLayout/i)).toBeInTheDocument();
  });

  it("renders LoginPage for /login", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/LoginPage/i)).toBeInTheDocument();
  });

  it("renders RegisterPage for /register", () => {
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/RegisterPage/i)).toBeInTheDocument();
  });

  it("renders EventJoinPage for /events/:eventId/join", () => {
    render(
      <MemoryRouter initialEntries={["/events/123/join"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/EventJoinPage/i)).toBeInTheDocument();
  });
});
