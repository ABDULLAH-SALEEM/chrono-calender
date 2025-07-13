import React from "react";
import { renderHook } from "@testing-library/react";
import { useAuth } from "../../src/hooks/useAuth";
import { AuthContext, AuthProvider } from "../../src/context/AuthContext";

describe("useAuth", () => {
  describe("when used within AuthProvider", () => {
    it("should return the auth context", () => {
      const mockContextValue = {
        user: { id: 1, email: "test@example.com" },
        isAuthenticated: true,
        loading: false,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn()
      };

      const wrapper = ({ children }) => (
        <AuthContext.Provider value={mockContextValue}>
          {children}
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toBe(mockContextValue);
    });

    it("should return the auth context with null values", () => {
      const mockContextValue = {
        user: null,
        isAuthenticated: false,
        loading: true,
        login: jest.fn(),
        register: jest.fn(),
        logout: jest.fn()
      };

      const wrapper = ({ children }) => (
        <AuthContext.Provider value={mockContextValue}>
          {children}
        </AuthContext.Provider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toBe(mockContextValue);
    });
  });

  describe("when used outside AuthProvider", () => {
    it("should throw an error", () => {
      // Mock console.error to suppress the error output in tests
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth must be used within a AuthProvider");

      consoleSpy.mockRestore();
    });
  });
});
