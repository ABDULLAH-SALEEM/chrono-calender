import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
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
});
