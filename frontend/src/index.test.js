import React from "react";
jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(() => ({ render: jest.fn() }))
}));
jest.mock("./reportWebVitals", () => jest.fn());
import "./index";
import reportWebVitals from "./reportWebVitals";

describe("index.js", () => {
  it("calls reportWebVitals", () => {
    expect(reportWebVitals).toHaveBeenCalled();
  });
});
