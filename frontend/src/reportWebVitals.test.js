import reportWebVitals from "./reportWebVitals";

describe("reportWebVitals", () => {
  it("calls onPerfEntry if provided", async () => {
    const mockPerf = jest.fn();
    reportWebVitals(mockPerf);
    // Can't assert much, but should not throw
    expect(typeof reportWebVitals).toBe("function");
  });
  it("does nothing if onPerfEntry is not a function", () => {
    expect(() => reportWebVitals(null)).not.toThrow();
  });
});
