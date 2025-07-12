import React from "react";

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoginPage from "../pages/LoginPage";

export const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { isAuthenticated } = useAuth();

  // If route requires auth and user is not authenticated, show GetStarted
  if (requireAuth && !isAuthenticated) {
    return <LoginPage />;
  }

  // If route is for non-authenticated users and user is authenticated, redirect to dashboard
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};
