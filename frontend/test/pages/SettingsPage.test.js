import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SettingsPage from "../../src/pages/SettingsPage";
import * as apis from "../../src/services/apis";
import * as useAuthHook from "../../src/hooks/useAuth";

jest.mock("../../src/services/apis");
jest.mock("../../src/hooks/useAuth");
jest.setTimeout(15000);

describe("SettingsPage", () => {
  const mockUser = { id: 1, timezone: "Europe/Berlin" };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthHook.useAuth.mockReturnValue({ user: mockUser });
    apis.authService.changePassword.mockResolvedValue({});
    apis.authService.updateTimezone.mockResolvedValue({});
  });

  it("renders password and timezone forms", () => {
    render(<SettingsPage />);
    expect(
      screen.getByPlaceholderText(/enter current password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/^enter new password$/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm new password/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/timezone/i)).toBeInTheDocument();
  });

  it("shows error if new passwords do not match", async () => {
    render(<SettingsPage />);
    fireEvent.change(screen.getByPlaceholderText(/enter current password/i), {
      target: { value: "currentpass" }
    });
    fireEvent.change(screen.getByPlaceholderText(/^enter new password$/i), {
      target: { value: "abc" }
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: "def" }
    });
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));
    await waitFor(
      () => {
        const msg = screen.queryByTestId("password-error-msg");
        if (!msg) throw new Error("No error message rendered");
        expect(msg).toHaveTextContent(/do not match/i);
      },
      { timeout: 5000 }
    );
  });

  it("changes password successfully", async () => {
    render(<SettingsPage />);
    fireEvent.change(screen.getByPlaceholderText(/enter current password/i), {
      target: { value: "old" }
    });
    fireEvent.change(screen.getByPlaceholderText(/^enter new password$/i), {
      target: { value: "newpass" }
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: "newpass" }
    });
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));
    await waitFor(() =>
      expect(apis.authService.changePassword).toHaveBeenCalled()
    );
    expect(await screen.findByText(/success/i)).toBeInTheDocument();
  });

  it("handles password change error", async () => {
    apis.authService.changePassword.mockRejectedValueOnce({
      response: { data: { message: "fail" } }
    });
    render(<SettingsPage />);
    fireEvent.change(screen.getByPlaceholderText(/enter current password/i), {
      target: { value: "old" }
    });
    fireEvent.change(screen.getByPlaceholderText(/^enter new password$/i), {
      target: { value: "newpass" }
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: "newpass" }
    });
    fireEvent.click(screen.getByRole("button", { name: /update password/i }));
    expect(await screen.findByText(/fail/i)).toBeInTheDocument();
  });

  it("changes timezone successfully", async () => {
    render(<SettingsPage />);
    const select = screen.getByLabelText(/timezone/i);
    fireEvent.mouseDown(select);
    const option = await screen.findByText(
      "Europe/London",
      {},
      { container: document.body }
    );
    fireEvent.click(option);
    fireEvent.click(screen.getByRole("button", { name: /update timezone/i }));
    await waitFor(
      () => {
        const msg = screen.queryByTestId("password-error-msg");
        if (!msg) {
          screen.debug();
          expect(screen.getByText(/timezone updated/i)).toBeInTheDocument();
        } else {
          expect(msg).toHaveTextContent(/timezone updated/i);
        }
      },
      { timeout: 5000 }
    );
  });

  it("handles timezone update error", async () => {
    apis.authService.updateTimezone.mockRejectedValueOnce({
      response: { data: { message: "fail" } }
    });
    render(<SettingsPage />);
    fireEvent.mouseDown(screen.getByLabelText(/timezone/i));
    const option = await screen.findByText(
      "Europe/London",
      {},
      { timeout: 3000 }
    );
    fireEvent.click(option);
    fireEvent.click(screen.getByRole("button", { name: /update timezone/i }));
    expect(
      await screen.findByText(/fail/i, {}, { timeout: 3000 })
    ).toBeInTheDocument();
  });
});
