import React from "react";
import { render, screen } from "@testing-library/react";
import TextField from "../../../src/components/formFields/textField";

describe("TextField", () => {
  it("renders without crashing", () => {
    render(<TextField label="Test Label" value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <TextField label="Test Label" value="" onChange={() => {}} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
