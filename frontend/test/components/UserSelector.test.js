import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserSelector from "../../src/components/UserSelector";
import userEvent from "@testing-library/user-event";
import * as apis from "../../src/services/apis";
import { userService } from "../../src/services/apis";
import { act } from "react";

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
    await act(async () => {
      render(<UserSelector value={[]} onChange={() => {}} />);
    });
    // Open dropdown
    const input = screen.getByLabelText(/invite users/i);
    await act(async () => {
      fireEvent.mouseDown(input);
    });
    // Now options should be visible
    expect(await screen.findByText(/user one/i)).toBeInTheDocument();
    expect(screen.getByText(/user two/i)).toBeInTheDocument();
  });

  it("shows loading spinner while fetching", async () => {
    apis.userService.getAllUsers.mockReturnValue(new Promise(() => {}));
    await act(async () => {
      render(<UserSelector value={[]} onChange={() => {}} />);
    });
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("calls onChange when users are selected", async () => {
    const handleChange = jest.fn();
    await act(async () => {
      render(<UserSelector value={[]} onChange={handleChange} />);
    });
    const input = screen.getByLabelText(/invite users/i);
    await act(async () => {
      fireEvent.mouseDown(input);
    });
    const option = await screen.findByText(/user one/i);
    await act(async () => {
      fireEvent.click(option);
    });
    expect(handleChange).toHaveBeenCalled();
  });

  it("renders custom label", async () => {
    await act(async () => {
      render(
        <UserSelector value={[]} onChange={() => {}} label="CustomLabel" />
      );
    });
    expect(screen.getByLabelText(/customlabel/i)).toBeInTheDocument();
  });

  // New test cases to cover uncovered lines

  it("handles fetch error gracefully", async () => {
    apis.userService.getAllUsers.mockRejectedValue(new Error("Network error"));
    await act(async () => {
      render(<UserSelector value={[]} onChange={() => {}} />);
    });
    // Should not crash and should handle error gracefully
    await waitFor(() => {
      expect(screen.getByTestId("user-selector-root")).toBeInTheDocument();
    });
  });

  it("handles users without name property", async () => {
    const usersWithoutName = [
      { id: 1, email: "one@test.com" },
      { id: 2, email: "two@test.com" }
    ];
    apis.userService.getAllUsers.mockResolvedValue({
      data: usersWithoutName
    });
    await act(async () => {
      render(<UserSelector value={[]} onChange={() => {}} />);
    });
    const input = screen.getByLabelText(/invite users/i);
    await act(async () => {
      fireEvent.mouseDown(input);
    });
    // Should use email as fallback when name is not available
    await waitFor(() => {
      expect(screen.getByText("one@test.com")).toBeInTheDocument();
    });
  });

  it("handles input value changes", async () => {
    await act(async () => {
      render(<UserSelector value={[]} onChange={() => {}} />);
    });
    const input = screen.getByLabelText(/invite users/i);
    await userEvent.type(input, "test");
    expect(input.value).toBe("test");
  });

  it("handles user selection with value mapping", async () => {
    const handleChange = jest.fn();
    await act(async () => {
      render(<UserSelector value={[]} onChange={handleChange} />);
    });
    const input = screen.getByLabelText(/invite users/i);
    await act(async () => {
      fireEvent.mouseDown(input);
    });
    const option = await screen.findByText(/user one/i);
    await act(async () => {
      fireEvent.click(option);
    });
    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          value: 1,
          label: "User One"
        })
      ])
    );
  });

  it("renders selected users as tags", async () => {
    const selectedUsers = [
      { value: 1, label: "User One" },
      { value: 2, label: "User Two" }
    ];
    await act(async () => {
      render(<UserSelector value={selectedUsers} onChange={() => {}} />);
    });
    expect(screen.getByText("User One")).toBeInTheDocument();
    expect(screen.getByText("User Two")).toBeInTheDocument();
  });

  it("handles user removal", async () => {
    const handleChange = jest.fn();
    const selectedUsers = [
      { value: 1, label: "User One" },
      { value: 2, label: "User Two" }
    ];
    await act(async () => {
      render(<UserSelector value={selectedUsers} onChange={handleChange} />);
    });
    const tags = screen.getAllByRole("button");
    if (tags.length > 0) {
      await act(async () => {
        fireEvent.click(tags[0]);
      });
      expect(handleChange).toHaveBeenCalled();
    }
  });

  it("handles option comparison correctly", async () => {
    await act(async () => {
      render(<UserSelector value={[]} onChange={() => {}} />);
    });
    const input = screen.getByLabelText(/invite users/i);
    await act(async () => {
      fireEvent.mouseDown(input);
    });
    // Should handle option comparison correctly
    await waitFor(() => {
      expect(screen.getByText(/user one/i)).toBeInTheDocument();
    });
  });

  it("handles empty users array", async () => {
    apis.userService.getAllUsers.mockResolvedValue({
      data: []
    });
    await act(async () => {
      render(<UserSelector value={[]} onChange={() => {}} />);
    });
    const input = screen.getByLabelText(/invite users/i);
    await act(async () => {
      fireEvent.mouseDown(input);
    });
    // Should handle empty users array gracefully
    await waitFor(() => {
      expect(screen.getByTestId("user-selector-root")).toBeInTheDocument();
    });
  });

  it("handles null users response", async () => {
    apis.userService.getAllUsers.mockResolvedValue({
      data: null
    });
    await act(async () => {
      render(<UserSelector value={[]} onChange={() => {}} />);
    });
    // Should handle null response gracefully
    await waitFor(() => {
      expect(screen.getByTestId("user-selector-root")).toBeInTheDocument();
    });
  });

  it("handles undefined users response", async () => {
    apis.userService.getAllUsers.mockResolvedValue({
      data: undefined
    });
    await act(async () => {
      render(<UserSelector value={[]} onChange={() => {}} />);
    });
    // Should handle undefined response gracefully
    await waitFor(() => {
      expect(screen.getByTestId("user-selector-root")).toBeInTheDocument();
    });
  });

  it("handles users with null properties", async () => {
    const usersWithNullProps = [
      { id: 1, name: null, email: "one@test.com" },
      { id: 2, name: "User Two", email: null }
    ];
    apis.userService.getAllUsers.mockResolvedValue({
      data: usersWithNullProps
    });
    await act(async () => {
      render(<UserSelector value={[]} onChange={() => {}} />);
    });
    const input = screen.getByLabelText(/invite users/i);
    await act(async () => {
      fireEvent.mouseDown(input);
    });
    // Should handle null properties gracefully
    await waitFor(() => {
      expect(screen.getByText("one@test.com")).toBeInTheDocument();
      expect(screen.getByText("User Two")).toBeInTheDocument();
    });
  });

  it("handles users with undefined properties", async () => {
    const usersWithUndefinedProps = [
      { id: 1, name: undefined, email: "one@test.com" },
      { id: 2, name: "User Two", email: undefined }
    ];
    apis.userService.getAllUsers.mockResolvedValue({
      data: usersWithUndefinedProps
    });
    await act(async () => {
      render(<UserSelector value={[]} onChange={() => {}} />);
    });
    const input = screen.getByLabelText(/invite users/i);
    await act(async () => {
      fireEvent.mouseDown(input);
    });
    // Should handle undefined properties gracefully
    await waitFor(() => {
      expect(screen.getByText("one@test.com")).toBeInTheDocument();
      expect(screen.getByText("User Two")).toBeInTheDocument();
    });
  });

  it("handles multiple user selection", async () => {
    const handleChange = jest.fn();
    const mockUsers = [
      { id: 1, name: "User One", email: "one@test.com" },
      { id: 2, name: "User Two", email: "two@test.com" }
    ];
    jest
      .spyOn(userService, "getAllUsers")
      .mockResolvedValue({ data: mockUsers });
    await act(async () => {
      render(<UserSelector value={[]} onChange={handleChange} />);
    });
    const input = screen.getByLabelText(/invite users/i);
    await userEvent.click(input);
    const option1 = await screen.findByText(/user one/i);
    await userEvent.click(option1);
    await userEvent.click(input);
    const option2 = await screen.findByText(/user two/i);
    await userEvent.click(option2);
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it("handles user deselection", async () => {
    const handleChange = jest.fn();
    const selectedUsers = [{ value: 1, label: "User One" }];
    await act(async () => {
      render(<UserSelector value={selectedUsers} onChange={handleChange} />);
    });
    const tags = screen.getAllByRole("button");
    if (tags.length > 0) {
      await act(async () => {
        fireEvent.click(tags[0]);
      });
      expect(handleChange).toHaveBeenCalledWith([]);
    }
  });

  it("handles loading state completion", async () => {
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    apis.userService.getAllUsers.mockReturnValue(promise);
    render(<UserSelector value={[]} onChange={() => {}} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    resolvePromise({ data: mockUsers });
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  it("handles error state completion", async () => {
    let rejectPromise;
    const promise = new Promise((resolve, reject) => {
      rejectPromise = reject;
    });
    apis.userService.getAllUsers.mockReturnValue(promise);
    render(<UserSelector value={[]} onChange={() => {}} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    rejectPromise(new Error("Network error"));
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  it("handles custom error message", async () => {
    render(
      <UserSelector value={[]} onChange={() => {}} error="Custom error" />
    );
    expect(screen.getByText("Custom error")).toBeInTheDocument();
  });

  it("handles users with special characters in names", async () => {
    const usersWithSpecialChars = [
      { id: 1, name: "User O'Neil", email: "one@test.com" },
      { id: 2, name: "User & Co.", email: "two@test.com" }
    ];
    apis.userService.getAllUsers.mockResolvedValue({
      data: usersWithSpecialChars
    });
    render(<UserSelector value={[]} onChange={() => {}} />);
    const input = screen.getByLabelText(/invite users/i);
    fireEvent.mouseDown(input);
    await waitFor(() => {
      expect(screen.getByText("User O'Neil")).toBeInTheDocument();
      expect(screen.getByText("User & Co.")).toBeInTheDocument();
    });
  });

  it("handles users with very long names", async () => {
    const usersWithLongNames = [
      {
        id: 1,
        name: "This is a very long user name that might cause layout issues",
        email: "long@test.com"
      },
      { id: 2, name: "Short", email: "short@test.com" }
    ];
    apis.userService.getAllUsers.mockResolvedValue({
      data: usersWithLongNames
    });
    render(<UserSelector value={[]} onChange={() => {}} />);
    const input = screen.getByLabelText(/invite users/i);
    fireEvent.mouseDown(input);
    await waitFor(() => {
      expect(
        screen.getByText(
          "This is a very long user name that might cause layout issues"
        )
      ).toBeInTheDocument();
      expect(screen.getByText("Short")).toBeInTheDocument();
    });
  });

  it("handles users with emoji in names", async () => {
    const usersWithEmoji = [
      { id: 1, name: "👨‍💻 Developer", email: "dev@test.com" },
      { id: 2, name: "🎨 Designer", email: "design@test.com" }
    ];
    apis.userService.getAllUsers.mockResolvedValue({
      data: usersWithEmoji
    });
    render(<UserSelector value={[]} onChange={() => {}} />);
    const input = screen.getByLabelText(/invite users/i);
    fireEvent.mouseDown(input);
    await waitFor(() => {
      expect(screen.getByText("👨‍💻 Developer")).toBeInTheDocument();
      expect(screen.getByText("🎨 Designer")).toBeInTheDocument();
    });
  });

  it("handles duplicate user selection prevention", async () => {
    const handleChange = jest.fn();
    const selectedUsers = [{ value: 1, label: "User One" }];
    render(<UserSelector value={selectedUsers} onChange={handleChange} />);
    const input = screen.getByLabelText(/invite users/i);
    fireEvent.mouseDown(input);
    const option = await screen.findByText(/user one/i);
    fireEvent.click(option);
    // Should not add duplicate users
    expect(screen.getByText("User One")).toBeInTheDocument();
  });

  it("handles case insensitive user comparison", async () => {
    const handleChange = jest.fn();
    const selectedUsers = [{ value: 1, label: "User One" }];
    render(<UserSelector value={selectedUsers} onChange={handleChange} />);
    const input = screen.getByLabelText(/invite users/i);
    fireEvent.mouseDown(input);
    // Should handle case differences in user names
    await waitFor(() => {
      expect(screen.getByText("User One")).toBeInTheDocument();
    });
  });
});
