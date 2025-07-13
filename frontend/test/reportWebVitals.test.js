// Mock the web-vitals functions
const mockGetCLS = jest.fn();
const mockGetFID = jest.fn();
const mockGetFCP = jest.fn();
const mockGetLCP = jest.fn();
const mockGetTTFB = jest.fn();

// Create a mock module for web-vitals
const mockWebVitalsModule = {
  getCLS: mockGetCLS,
  getFID: mockGetFID,
  getFCP: mockGetFCP,
  getLCP: mockGetLCP,
  getTTFB: mockGetTTFB
};

// Mock the web-vitals module
jest.mock("web-vitals", () => ({
  getCLS: mockGetCLS,
  getFID: mockGetFID,
  getFCP: mockGetFCP,
  getLCP: mockGetLCP,
  getTTFB: mockGetTTFB
}));

describe("reportWebVitals", () => {
  let reportWebVitals;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    // Clear the module cache and require the module
    delete require.cache[require.resolve("../src/reportWebVitals")];
    reportWebVitals = require("../src/reportWebVitals").default;
  });

  describe("when onPerfEntry is a function", () => {
    it("should import web-vitals and call all performance functions", async () => {
      const mockOnPerfEntry = function () {};

      reportWebVitals(mockOnPerfEntry);

      // Wait for the async import to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockGetCLS).toHaveBeenCalledWith(mockOnPerfEntry);
      expect(mockGetFID).toHaveBeenCalledWith(mockOnPerfEntry);
      expect(mockGetFCP).toHaveBeenCalledWith(mockOnPerfEntry);
      expect(mockGetLCP).toHaveBeenCalledWith(mockOnPerfEntry);
      expect(mockGetTTFB).toHaveBeenCalledWith(mockOnPerfEntry);
    });

    it("should call all web-vitals functions with the provided callback", async () => {
      const mockCallback = function () {};

      reportWebVitals(mockCallback);

      // Wait for the async import to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockGetCLS).toHaveBeenCalledWith(mockCallback);
      expect(mockGetFID).toHaveBeenCalledWith(mockCallback);
      expect(mockGetFCP).toHaveBeenCalledWith(mockCallback);
      expect(mockGetLCP).toHaveBeenCalledWith(mockCallback);
      expect(mockGetTTFB).toHaveBeenCalledWith(mockCallback);
    });

    it("should call each web-vitals function exactly once", async () => {
      const mockCallback = function () {};

      reportWebVitals(mockCallback);

      // Wait for the async import to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockGetCLS).toHaveBeenCalledTimes(1);
      expect(mockGetFID).toHaveBeenCalledTimes(1);
      expect(mockGetFCP).toHaveBeenCalledTimes(1);
      expect(mockGetLCP).toHaveBeenCalledTimes(1);
      expect(mockGetTTFB).toHaveBeenCalledTimes(1);
    });

    it("should import web-vitals module", async () => {
      const mockCallback = function () {};

      reportWebVitals(mockCallback);

      // Wait for the async import to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      // Since we're mocking the module directly, we can't test the import call
      // but we can verify the functions were called
      expect(mockGetCLS).toHaveBeenCalled();
    });
  });

  describe("when onPerfEntry is not a function", () => {
    it("should not call any web-vitals functions when onPerfEntry is null", () => {
      reportWebVitals(null);

      expect(mockGetCLS).not.toHaveBeenCalled();
      expect(mockGetFID).not.toHaveBeenCalled();
      expect(mockGetFCP).not.toHaveBeenCalled();
      expect(mockGetLCP).not.toHaveBeenCalled();
      expect(mockGetTTFB).not.toHaveBeenCalled();
    });

    it("should not call any web-vitals functions when onPerfEntry is undefined", () => {
      reportWebVitals(undefined);

      expect(mockGetCLS).not.toHaveBeenCalled();
      expect(mockGetFID).not.toHaveBeenCalled();
      expect(mockGetFCP).not.toHaveBeenCalled();
      expect(mockGetLCP).not.toHaveBeenCalled();
      expect(mockGetTTFB).not.toHaveBeenCalled();
    });

    it("should not call any web-vitals functions when onPerfEntry is a string", () => {
      reportWebVitals("not a function");

      expect(mockGetCLS).not.toHaveBeenCalled();
      expect(mockGetFID).not.toHaveBeenCalled();
      expect(mockGetFCP).not.toHaveBeenCalled();
      expect(mockGetLCP).not.toHaveBeenCalled();
      expect(mockGetTTFB).not.toHaveBeenCalled();
    });

    it("should not call any web-vitals functions when onPerfEntry is a number", () => {
      reportWebVitals(123);

      expect(mockGetCLS).not.toHaveBeenCalled();
      expect(mockGetFID).not.toHaveBeenCalled();
      expect(mockGetFCP).not.toHaveBeenCalled();
      expect(mockGetLCP).not.toHaveBeenCalled();
      expect(mockGetTTFB).not.toHaveBeenCalled();
    });

    it("should not call any web-vitals functions when onPerfEntry is an object", () => {
      reportWebVitals({});

      expect(mockGetCLS).not.toHaveBeenCalled();
      expect(mockGetFID).not.toHaveBeenCalled();
      expect(mockGetFCP).not.toHaveBeenCalled();
      expect(mockGetLCP).not.toHaveBeenCalled();
      expect(mockGetTTFB).not.toHaveBeenCalled();
    });

    it("should not call any web-vitals functions when onPerfEntry is an array", () => {
      reportWebVitals([]);

      expect(mockGetCLS).not.toHaveBeenCalled();
      expect(mockGetFID).not.toHaveBeenCalled();
      expect(mockGetFCP).not.toHaveBeenCalled();
      expect(mockGetLCP).not.toHaveBeenCalled();
      expect(mockGetTTFB).not.toHaveBeenCalled();
    });

    it("should not call any web-vitals functions when onPerfEntry is false", () => {
      reportWebVitals(false);

      expect(mockGetCLS).not.toHaveBeenCalled();
      expect(mockGetFID).not.toHaveBeenCalled();
      expect(mockGetFCP).not.toHaveBeenCalled();
      expect(mockGetLCP).not.toHaveBeenCalled();
      expect(mockGetTTFB).not.toHaveBeenCalled();
    });
  });

  describe("function type checking", () => {
    it("should recognize arrow functions as valid functions", async () => {
      const arrowFunction = () => {};

      reportWebVitals(arrowFunction);

      // Wait for the async import to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockGetCLS).toHaveBeenCalledWith(arrowFunction);
      expect(mockGetFID).toHaveBeenCalledWith(arrowFunction);
      expect(mockGetFCP).toHaveBeenCalledWith(arrowFunction);
      expect(mockGetLCP).toHaveBeenCalledWith(arrowFunction);
      expect(mockGetTTFB).toHaveBeenCalledWith(arrowFunction);
    });

    it("should recognize function declarations as valid functions", async () => {
      function functionDeclaration() {}

      reportWebVitals(functionDeclaration);

      // Wait for the async import to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockGetCLS).toHaveBeenCalledWith(functionDeclaration);
      expect(mockGetFID).toHaveBeenCalledWith(functionDeclaration);
      expect(mockGetFCP).toHaveBeenCalledWith(functionDeclaration);
      expect(mockGetLCP).toHaveBeenCalledWith(functionDeclaration);
      expect(mockGetTTFB).toHaveBeenCalledWith(functionDeclaration);
    });

    it("should recognize function expressions as valid functions", async () => {
      const functionExpression = function () {};

      reportWebVitals(functionExpression);

      // Wait for the async import to complete
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockGetCLS).toHaveBeenCalledWith(functionExpression);
      expect(mockGetFID).toHaveBeenCalledWith(functionExpression);
      expect(mockGetFCP).toHaveBeenCalledWith(functionExpression);
      expect(mockGetLCP).toHaveBeenCalledWith(functionExpression);
      expect(mockGetTTFB).toHaveBeenCalledWith(functionExpression);
    });
  });

  describe("export functionality", () => {
    it("should export reportWebVitals as default export", () => {
      const reportWebVitalsModule = require("../src/reportWebVitals");

      expect(reportWebVitalsModule).toHaveProperty("default");
      expect(typeof reportWebVitalsModule.default).toBe("function");
    });

    it("should export a function", () => {
      expect(typeof reportWebVitals).toBe("function");
    });
  });
});
