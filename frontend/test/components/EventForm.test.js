import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EventForm from "../../src/components/EventForm";
import { AuthContext } from "../../src/context/AuthContext";
import * as userServiceModule from "../../src/services/apis";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const mockUser = { id: "1", name: "Test User" };
const mockOwner = { id: "1", name: "Test User" };
const mockUsers = [
  { id: "1", name: "Test User" },
  { id: "2", name: "Other User" }
];

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn()
  }
});

// Mock MUI DateTimePicker to a simple input for testing
jest.mock("@mui/x-date-pickers/DateTimePicker", () => ({
  __esModule: true,
  DateTimePicker: ({ value, onChange, label, ...props }) => (
    <input
      data-testid={label}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      {...props}
    />
  )
}));

describe("EventForm", () => {
  beforeEach(() => {
    jest.spyOn(userServiceModule.userService, "getAllUsers").mockResolvedValue({
      data: mockUsers
    });
    jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderWithAuth = (props = {}) =>
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthContext.Provider value={{ user: mockUser }}>
          <EventForm {...props} />
        </AuthContext.Provider>
      </LocalizationProvider>
    );

  // Helper to check if any FormHelperText contains the given text
  function hasHelperText(text) {
    return Array.from(
      document.querySelectorAll(".MuiFormHelperText-root")
    ).some((el) => el.textContent.includes(text));
  }

  // Helper to log all FormHelperText contents for debugging
  function logAllHelperTexts() {
    const all = Array.from(
      document.querySelectorAll(".MuiFormHelperText-root")
    ).map((el) => el.textContent);
    // eslint-disable-next-line no-console
    console.log("All FormHelperText:", all);
    return all;
  }

  it("renders all fields and buttons", async () => {
    renderWithAuth();
    expect(await screen.findByText(/Create New Event/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Event title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Event description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    // Use textbox role for date pickers
    const textboxes = screen.getAllByRole("textbox");
    expect(textboxes.length).toBeGreaterThan(1);
    expect(screen.getByLabelText(/Priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Recurring/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tags/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Invite Users/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
    expect(screen.getByTestId("event-form-submit")).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    renderWithAuth();
    // Blur all required fields to trigger validation
    fireEvent.blur(screen.getByLabelText(/Event title/i));
    fireEvent.blur(screen.getByLabelText(/Event description/i));
    const textboxes = screen.getAllByRole("textbox");
    fireEvent.blur(textboxes[0]); // start date
    fireEvent.blur(textboxes[1]); // end date
    fireEvent.click(screen.getByTestId("event-form-submit"));
    await waitFor(() => {
      if (
        !hasHelperText("Title is required") ||
        !hasHelperText("Description is required") ||
        !hasHelperText("Start date/time is required") ||
        !hasHelperText("End date/time is required")
      ) {
        logAllHelperTexts();
      }
      expect(hasHelperText("Title is required")).toBe(true);
      expect(hasHelperText("Description is required")).toBe(true);
      expect(hasHelperText("Start date/time is required")).toBe(true);
      expect(hasHelperText("End date/time is required")).toBe(true);
    });
  });

  it("submits form with valid data", async () => {
    const onSubmit = jest.fn();
    renderWithAuth({ onSubmit });
    await waitFor(() =>
      expect(screen.getByLabelText(/Event title/i)).toBeInTheDocument()
    );
    fireEvent.change(screen.getByLabelText(/Event title/i), {
      target: { value: "Test Event" }
    });
    fireEvent.change(screen.getByLabelText(/Event description/i), {
      target: { value: "Test Description" }
    });
    fireEvent.change(screen.getByTestId("Start Date/Time"), {
      target: { value: "2024-01-01T10:00" }
    });
    fireEvent.blur(screen.getByTestId("Start Date/Time"));
    fireEvent.change(screen.getByTestId("End Date/Time"), {
      target: { value: "2024-01-01T12:00" }
    });
    fireEvent.blur(screen.getByTestId("End Date/Time"));
    fireEvent.click(screen.getByTestId("event-form-submit"));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  });

  it("shows error if end date is before start date", async () => {
    renderWithAuth();
    await waitFor(() =>
      expect(screen.getByLabelText(/Event title/i)).toBeInTheDocument()
    );
    fireEvent.change(screen.getByLabelText(/Event title/i), {
      target: { value: "Test Event" }
    });
    fireEvent.change(screen.getByLabelText(/Event description/i), {
      target: { value: "Test Description" }
    });
    fireEvent.change(screen.getByTestId("Start Date/Time"), {
      target: { value: "2024-01-01T12:00" }
    });
    fireEvent.blur(screen.getByTestId("Start Date/Time"));
    fireEvent.change(screen.getByTestId("End Date/Time"), {
      target: { value: "2024-01-01T10:00" }
    });
    fireEvent.blur(screen.getByTestId("End Date/Time"));
    fireEvent.click(screen.getByTestId("event-form-submit"));
    await waitFor(() => {
      if (!hasHelperText("after start date/time")) {
        logAllHelperTexts();
      }
      expect(hasHelperText("after start date/time")).toBe(true);
    });
  });

  it("calls onCancel when Cancel button is clicked", async () => {
    const onCancel = jest.fn();
    renderWithAuth({ onCancel });
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(onCancel).toHaveBeenCalled();
  });

  it("shows Delete and Copy Link buttons for Update and owner", async () => {
    renderWithAuth({
      submitLabel: "Update",
      initialValues: { owner: mockOwner },
      eventId: "123"
    });
    expect(await screen.findByText(/Delete/i)).toBeInTheDocument();
    expect(screen.getByText(/Copy Link/i)).toBeInTheDocument();
  });

  it("opens and closes delete dialog", async () => {
    const onDelete = jest.fn();
    renderWithAuth({
      submitLabel: "Update",
      initialValues: { owner: mockOwner },
      onDelete
    });
    fireEvent.click(await screen.findByText(/Delete/i));
    expect(
      screen.getByText(/Are you sure you want to delete/i)
    ).toBeInTheDocument();
    // Use getAllByText for Cancel
    const cancelButtons = screen.getAllByText(/^Cancel$/);
    fireEvent.click(cancelButtons[cancelButtons.length - 1]);
    await waitFor(() => {
      expect(
        screen.queryByText(/Are you sure you want to delete/i)
      ).not.toBeInTheDocument();
    });
  });

  it("calls onDelete when confirming delete", async () => {
    const onDelete = jest.fn();
    renderWithAuth({
      submitLabel: "Update",
      initialValues: { owner: mockOwner },
      onDelete
    });
    fireEvent.click(await screen.findByText(/Delete/i));
    // Use getAllByText for Delete
    const deleteButtons = screen.getAllByText(/^Delete$/);
    fireEvent.click(deleteButtons[deleteButtons.length - 1]);
    await waitFor(() => expect(onDelete).toHaveBeenCalled());
  });

  it("copies event link to clipboard", async () => {
    renderWithAuth({
      submitLabel: "Update",
      initialValues: { owner: mockOwner },
      eventId: "123"
    });
    fireEvent.click(screen.getByText(/Copy Link/i));
    await waitFor(() =>
      expect(navigator.clipboard.writeText).toHaveBeenCalled()
    );
  });
});
