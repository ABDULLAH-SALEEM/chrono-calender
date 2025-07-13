import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../src/context/AuthContext";
import MainLayout from "../../src/pages/MainLayout";

describe("MainLayout", () => {
  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={{ user: {}, login: jest.fn() }}>
          <MainLayout />
        </AuthContext.Provider>
      </MemoryRouter>
    );
  });
});
