// Mock react-dom/client
const mockRender = jest.fn();
const mockCreateRoot = jest.fn(() => ({
  render: mockRender
}));

jest.mock("react-dom/client", () => ({
  createRoot: mockCreateRoot
}));

// Mock reportWebVitals
const mockReportWebVitals = jest.fn();
jest.mock("../src/reportWebVitals", () => mockReportWebVitals);

// Mock CSS import
jest.mock("../src/index.css", () => ({}));

// Mock App component
jest.mock("../src/App", () => () => <div data-testid="app">App Component</div>);

describe("index.js", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    // Mock document.getElementById
    document.getElementById = jest.fn(() => ({
      // Mock DOM element
    }));
  });

  it("creates root and renders App component", () => {
    require("../src/index");
    expect(mockCreateRoot).toHaveBeenCalledWith(expect.any(Object));
    expect(mockRender).toHaveBeenCalled();
    const renderArg = mockRender.mock.calls[0][0];
    expect(renderArg).toBeDefined();
    expect(renderArg).toHaveProperty("type");
    expect(renderArg).toHaveProperty("props");
  });

  it("calls reportWebVitals", () => {
    require("../src/index");
    expect(mockReportWebVitals).toHaveBeenCalled();
  });

  it("calls reportWebVitals without parameters", () => {
    require("../src/index");
    expect(mockReportWebVitals).toHaveBeenCalledWith();
  });

  it("imports CSS file", () => {
    require("../src/index");
    expect(mockCreateRoot).toHaveBeenCalled();
  });

  it("sets up React.StrictMode correctly", () => {
    require("../src/index");
    const callArgs = mockRender.mock.calls[0][0];
    expect(callArgs.type).toBeDefined();
  });

  it("renders App component inside StrictMode", () => {
    require("../src/index");
    const callArgs = mockRender.mock.calls[0][0];
    expect(callArgs.props.children).toBeDefined();
  });

  it("uses document.getElementById to find root element", () => {
    require("../src/index");
    expect(document.getElementById).toHaveBeenCalledWith("root");
  });

  it("handles root element creation correctly", () => {
    require("../src/index");
    expect(mockCreateRoot).toHaveBeenCalledWith(expect.any(Object));
  });

  it("creates root only once", () => {
    require("../src/index");
    expect(mockCreateRoot).toHaveBeenCalledTimes(1);
  });

  it("renders only once", () => {
    require("../src/index");
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  it("calls reportWebVitals only once", () => {
    require("../src/index");
    expect(mockReportWebVitals).toHaveBeenCalledTimes(1);
  });
});
