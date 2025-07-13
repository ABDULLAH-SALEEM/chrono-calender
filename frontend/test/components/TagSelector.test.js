import React from "react";
import { render, screen } from "@testing-library/react";
import TagSelector from "../../src/components/TagSelector";

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
