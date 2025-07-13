import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserSelector from "../../src/components/UserSelector";
import userEvent from "@testing-library/user-event";
import * as apis from "../../src/services/apis";

jest.mock("../../src/services/apis");

describe("UserSelector extended", () => {
  const mockUsers = [
    { id: 1, name: "User One", email: "one@test.com" },
    { id: 2, name: "User Two", email: "two@test.com" }
  ];
  beforeEach(() => {
    apis.userService.getAllUsers.mockResolvedValue({
      data: mockUsers
    });
  });

  it("fetches and displays user options", async () => {
    render(<UserSelector value={[]} onChange={() => {}} />);
    // Open dropdown
    const input = screen.getByLabelText(/invite users/i);
    fireEvent.mouseDown(input);
    // Now options should be visible
    expect(await screen.findByText(/user one/i)).toBeInTheDocument();
    expect(screen.getByText(/user two/i)).toBeInTheDocument();
  });

  it("shows loading spinner while fetching", async () => {
    apis.userService.getAllUsers.mockReturnValue(new Promise(() => {}));
    render(<UserSelector value={[]} onChange={() => {}} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("calls onChange when users are selected", async () => {
    const handleChange = jest.fn();
    render(<UserSelector value={[]} onChange={handleChange} />);
    const input = screen.getByLabelText(/invite users/i);
    fireEvent.mouseDown(input);
    const option = await screen.findByText(/user one/i);
    fireEvent.click(option);
    expect(handleChange).toHaveBeenCalled();
  });

  it("renders custom label", () => {
    render(<UserSelector value={[]} onChange={() => {}} label="CustomLabel" />);
    expect(screen.getByLabelText(/customlabel/i)).toBeInTheDocument();
  });
});
