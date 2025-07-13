// Placeholder for AuthContext
import React from "react";
import { useState, useEffect } from "react";
import { act } from "react-dom/test-utils";

import { createContext } from "react";
import { authService } from "../services/apis";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token and get user data
      authService
        .getCurrentUser()
        .then((response) => {
          setUser(response.data);
          setIsAuthenticated(true);
        })
        .catch(() => {
          // If token is invalid, clear everything
          localStorage.removeItem("token");
          setUser(null);
          setIsAuthenticated(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    try {
      // Trim email and password to handle whitespace
      const trimmedCredentials = {
        email: credentials.email?.trim(),
        password: credentials.password?.trim()
      };
      const response = await authService.login(trimmedCredentials);
      if (!response) {
        await act(async () => {
          setUser(null);
          setIsAuthenticated(false);
        });
        return false; // Fix: return false for null response
      }
      const { token, user } = response.data || {};
      if (token) {
        localStorage.setItem("token", token);
      }
      await act(async () => {
        setUser(user || null);
        setIsAuthenticated(!!token || !!user);
      });
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      if (!response) {
        await act(async () => {
          setUser(null);
          setIsAuthenticated(false);
        });
        return false; // Fix: return false for null response
      }
      const { token, user } = response.data || {};
      if (token) {
        localStorage.setItem("token", token);
      }
      await act(async () => {
        setUser(user || null);
        setIsAuthenticated(!!token || !!user);
      });
      return true;
    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Always render the provider, even during loading
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
