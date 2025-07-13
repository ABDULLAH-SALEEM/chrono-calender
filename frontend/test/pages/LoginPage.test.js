import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../src/context/AuthContext";
import LoginPage from "../../src/pages/LoginPage";

describe("LoginPage", () => {
  const mockLogin = jest.fn();
  const mockNavigate = jest.fn();

  beforeEach(() => {
    mockLogin.mockClear();
    mockNavigate.mockClear();
  });

  const renderWithAuth = () =>
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: {}, login: mockLogin }}>
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );

  it("renders without crashing", () => {
    renderWithAuth();
    expect(screen.getByText(/Welcome back to Chrono/i)).toBeInTheDocument();
  });

  // New test cases to cover uncovered lines

  it("handles successful login", async () => {
    mockLogin.mockResolvedValue(true);
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123"
      });
    });
  });

  it("handles login failure", async () => {
    mockLogin.mockResolvedValue(false);
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "wrongpassword"
      });
    });
  });

  it("handles login error", async () => {
    mockLogin.mockRejectedValue(new Error("Network error"));
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123"
      });
    });
  });

  it("handles form submission with empty fields", async () => {
    renderWithAuth();

    const submitButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(submitButton);

    // Should not call login with empty fields
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("handles form submission with only email", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(submitButton);

    // Should not call login with missing password
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("handles form submission with only password", async () => {
    renderWithAuth();

    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    // Should not call login with missing email
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("handles form submission with invalid email format", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    // Should not call login with invalid email
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("handles form submission with very long email", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    const longEmail = "a".repeat(100) + "@example.com";
    fireEvent.change(emailInput, { target: { value: longEmail } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: longEmail,
        password: "password123"
      });
    });
  });

  it("handles form submission with very long password", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    const longPassword = "a".repeat(100);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: longPassword } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: longPassword
      });
    });
  });

  it("handles form submission with special characters in email", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test+tag@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test+tag@example.com",
        password: "password123"
      });
    });
  });

  it("handles form submission with special characters in password", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "pass@word#123!" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "pass@word#123!"
      });
    });
  });

  it("handles form submission with whitespace in email", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "  test@example.com  " } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123"
      });
    });
  });

  it("handles form submission with whitespace in password", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "  password123  " } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123"
      });
    });
  });

  it("handles form submission with emoji in email", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test😀@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test😀@example.com",
        password: "password123"
      });
    });
  });

  it("handles form submission with emoji in password", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "pass😀word123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "pass😀word123"
      });
    });
  });

  it("handles form submission with null values", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: null } });
    fireEvent.change(passwordInput, { target: { value: null } });
    fireEvent.click(submitButton);

    // Should not call login with null values
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("handles form submission with undefined values", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: undefined } });
    fireEvent.change(passwordInput, { target: { value: undefined } });
    fireEvent.click(submitButton);

    // Should not call login with undefined values
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("handles form submission with empty string values", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });
    fireEvent.click(submitButton);

    // Should not call login with empty strings
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("handles form submission with only whitespace values", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "   " } });
    fireEvent.change(passwordInput, { target: { value: "   " } });
    fireEvent.click(submitButton);

    // Should not call login with only whitespace
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("handles form submission with numbers in email", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test123@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test123@example.com",
        password: "password123"
      });
    });
  });

  it("handles form submission with numbers in password", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "123456789" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "123456789"
      });
    });
  });

  it("handles form submission with mixed case email", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "Test@Example.COM" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "Test@Example.COM",
        password: "password123"
      });
    });
  });

  it("handles form submission with mixed case password", async () => {
    renderWithAuth();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "PassWord123" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "PassWord123"
      });
    });
  });
});
