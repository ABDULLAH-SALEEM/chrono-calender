import React from "react";
import "./App.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./utils/theme";
import MainLayout from "./pages/MainLayout";
import { motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { AnimatePresence } from "framer-motion";
import { Route, BrowserRouter, Routes, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import EventJoinPage from "./pages/EventJoinPage";

function App() {
  const AnimatedRoutes = () => {
    const location = useLocation();
    const pageTransition = {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { duration: 0.3, ease: "easeInOut" }
    };

    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <motion.div {...pageTransition}>
                  <MainLayout />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute requireAuth={false}>
                <motion.div {...pageTransition}>
                  <LoginPage />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute requireAuth={false}>
                <motion.div {...pageTransition}>
                  <RegisterPage />
                </motion.div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:eventId/join"
            element={
              <ProtectedRoute>
                <motion.div {...pageTransition}>
                  <EventJoinPage />
                </motion.div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <CssBaseline />
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
