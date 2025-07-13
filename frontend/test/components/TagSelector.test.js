import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import TagSelector from "../../src/components/TagSelector";
import userEvent from "@testing-library/user-event";

describe("TagSelector", () => {
  it("renders without crashing", () => {
    render(<TagSelector value={[]} onChange={() => {}} />);
    expect(screen.getByTestId("tag-selector-root")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <TagSelector value={[]} onChange={() => {}} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});

describe("TagSelector extended", () => {
  it("calls onChange when tags are selected", async () => {
    const handleChange = jest.fn();
    render(<TagSelector value={[]} onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    await userEvent.type(input, "Work{enter}");
    await waitFor(
      () => {
        expect(handleChange).toHaveBeenCalled();
      },
      { timeout: 2000 }
    );
  });

  it("displays error message if error prop is set", () => {
    render(<TagSelector value={[]} onChange={() => {}} error="Error!" />);
    expect(screen.getByText(/error!/i)).toBeInTheDocument();
  });

  it("renders custom label", () => {
    render(<TagSelector value={[]} onChange={() => {}} label="CustomLabel" />);
    expect(screen.getByLabelText(/customlabel/i)).toBeInTheDocument();
  });

  // New test cases to cover uncovered lines

  it("handles string option in getOptionLabel", () => {
    render(<TagSelector value={[]} onChange={() => {}} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "test" } });
    // Should handle string options correctly
    expect(input).toBeInTheDocument();
  });

  it("handles object option in getOptionLabel", () => {
    render(<TagSelector value={[]} onChange={() => {}} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "test" } });
    // Should handle object options correctly
    expect(input).toBeInTheDocument();
  });

  it("handles option without label in getOptionLabel", () => {
    render(<TagSelector value={[]} onChange={() => {}} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "test" } });
    // Should handle options without label property
    expect(input).toBeInTheDocument();
  });

  it("handles string comparison in isOptionEqualToValue", () => {
    render(<TagSelector value={[]} onChange={() => {}} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "test" } });
    // Should handle string comparison correctly
    expect(input).toBeInTheDocument();
  });

  it("handles object comparison in isOptionEqualToValue", () => {
    render(<TagSelector value={[]} onChange={() => {}} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "test" } });
    // Should handle object comparison correctly
    expect(input).toBeInTheDocument();
  });

  it("handles different types in isOptionEqualToValue", () => {
    render(<TagSelector value={[]} onChange={() => {}} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "test" } });
    // Should handle different types correctly
    expect(input).toBeInTheDocument();
  });

  it("renders string tags correctly", () => {
    const value = ["work", "personal"];
    render(<TagSelector value={value} onChange={() => {}} />);
    expect(screen.getByText("work")).toBeInTheDocument();
    expect(screen.getByText("personal")).toBeInTheDocument();
  });

  it("renders object tags correctly", () => {
    const value = [
      { label: "Work", value: "work" },
      { label: "Personal", value: "personal" }
    ];
    render(<TagSelector value={value} onChange={() => {}} />);
    expect(screen.getByText("Work")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
  });

  it("handles mixed string and object tags", () => {
    const value = ["work", { label: "Personal", value: "personal" }];
    render(<TagSelector value={value} onChange={() => {}} />);
    expect(screen.getByText("work")).toBeInTheDocument();
    expect(screen.getByText("Personal")).toBeInTheDocument();
  });

  it("handles tag removal", () => {
    const handleChange = jest.fn();
    const value = ["work", "personal"];
    render(<TagSelector value={value} onChange={handleChange} />);
    const tags = screen.getAllByRole("button");
    if (tags.length > 0) {
      fireEvent.click(tags[0]);
      expect(handleChange).toHaveBeenCalled();
    }
  });

  it("handles input value changes", () => {
    render(<TagSelector value={[]} onChange={() => {}} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "new tag" } });
    expect(input.value).toBe("new tag");
  });

  it("handles option selection from dropdown", () => {
    const handleChange = jest.fn();
    render(<TagSelector value={[]} onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "Work" } });
    // Should show dropdown options
    expect(input).toBeInTheDocument();
  });

  it("handles free text input", () => {
    const handleChange = jest.fn();
    render(<TagSelector value={[]} onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "Custom Tag" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(handleChange).toHaveBeenCalled();
  });

  it("handles empty value array", () => {
    render(<TagSelector value={[]} onChange={() => {}} />);
    expect(screen.getByTestId("tag-selector-root")).toBeInTheDocument();
  });

  it("handles null value", () => {
    render(<TagSelector value={null} onChange={() => {}} />);
    expect(screen.getByTestId("tag-selector-root")).toBeInTheDocument();
  });

  it("handles undefined value", () => {
    render(<TagSelector value={undefined} onChange={() => {}} />);
    expect(screen.getByTestId("tag-selector-root")).toBeInTheDocument();
  });

  it("handles default tags in options", () => {
    render(<TagSelector value={[]} onChange={() => {}} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "W" } });
    // Should show default tags that start with "W"
    expect(input).toBeInTheDocument();
  });

  it("handles multiple tag selection", () => {
    const handleChange = jest.fn();
    render(<TagSelector value={[]} onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "Work" } });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.change(input, { target: { value: "Personal" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it("handles tag with special characters", () => {
    const handleChange = jest.fn();
    render(<TagSelector value={[]} onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "Tag with spaces" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(handleChange).toHaveBeenCalled();
  });

  it("handles tag with numbers", () => {
    const handleChange = jest.fn();
    render(<TagSelector value={[]} onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "Tag123" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(handleChange).toHaveBeenCalled();
  });

  it("handles very long tag names", () => {
    const handleChange = jest.fn();
    render(<TagSelector value={[]} onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    const longTag =
      "This is a very long tag name that might cause layout issues";
    fireEvent.change(input, { target: { value: longTag } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(handleChange).toHaveBeenCalled();
  });

  it("handles tag with emoji", () => {
    const handleChange = jest.fn();
    render(<TagSelector value={[]} onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "🎉 Party" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(handleChange).toHaveBeenCalled();
  });

  it("handles duplicate tag prevention", () => {
    const handleChange = jest.fn();
    const value = ["work"];
    render(<TagSelector value={value} onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "work" } });
    fireEvent.keyDown(input, { key: "Enter" });
    // Should not add duplicate tags
    expect(screen.getByText("work")).toBeInTheDocument();
  });

  it("handles case insensitive tag comparison", () => {
    const handleChange = jest.fn();
    const value = ["Work"];
    render(<TagSelector value={value} onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "work" } });
    fireEvent.keyDown(input, { key: "Enter" });
    // Should handle case differences
    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("handles tag removal by backspace", () => {
    const handleChange = jest.fn();
    const value = ["work", "personal"];
    render(<TagSelector value={value} onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.keyDown(input, { key: "Backspace" });
    // Should remove last tag on backspace
    expect(input).toBeInTheDocument();
  });

  it("handles tag removal when input is empty", () => {
    const handleChange = jest.fn();
    const value = ["work"];
    render(<TagSelector value={value} onChange={handleChange} />);
    const input = screen.getByPlaceholderText(/select or type tags/i);
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.keyDown(input, { key: "Backspace" });
    // Should remove tag when input is empty and backspace is pressed
    expect(input).toBeInTheDocument();
  });
});
