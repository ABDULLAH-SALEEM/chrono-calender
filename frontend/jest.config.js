module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleFileExtensions: ["js", "jsx"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^~/(.*)$": "<rootDir>/src/$1"
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "test/**/*.{js,jsx}",
    "!**/node_modules/**",
    "!src/pages/CalendarPage.js"
  ],
  coverageThreshold: {
    global: {
      lines: 90
    }
  },
  testMatch: ["<rootDir>/test/**/*.test.js", "<rootDir>/test/**/*.spec.js"],
  testPathIgnorePatterns: ["<rootDir>/src/pages/CalendarPage.js"],
  transformIgnorePatterns: [
    "/node_modules/(?!(axios|date-fns|@mui/x-date-pickers)/)"
  ]
};
