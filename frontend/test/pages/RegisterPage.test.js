import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../../src/pages/RegisterPage";
import * as useAuthHook from "../../src/hooks/useAuth";
import * as router from "react-router-dom";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../src/hooks/useAuth");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn()
}));

describe("RegisterPage", () => {
  const mockRegister = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthHook.useAuth.mockReturnValue({ register: mockRegister });
    router.useNavigate.mockReturnValue(mockNavigate);
  });

  it("renders the registration form", () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("submits the form and navigates on success", async () => {
    mockRegister.mockResolvedValue(true);
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test" }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@test.com" }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" }
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await waitFor(() => expect(mockRegister).toHaveBeenCalled());
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("handles registration failure", async () => {
    mockRegister.mockResolvedValue(false);
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test" }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@test.com" }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" }
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await waitFor(() => expect(mockRegister).toHaveBeenCalled());
    // Should not navigate
    expect(mockNavigate).not.toHaveBeenCalledWith("/");
  });

  it("handles registration error", async () => {
    mockRegister.mockRejectedValueOnce(new Error("fail"));
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Test" }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@test.com" }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" }
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));
    await waitFor(() => expect(mockRegister).toHaveBeenCalled());
  });
});
