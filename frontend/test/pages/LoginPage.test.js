import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../src/context/AuthContext";
import LoginPage from "../../src/pages/LoginPage";

describe("LoginPage", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: {}, login: jest.fn() }}>
          <LoginPage />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  });
});
