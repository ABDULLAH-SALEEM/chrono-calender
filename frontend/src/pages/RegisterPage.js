import React from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import CustomTextField from "../components/formFields/textField";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const success = await register(data);
      if (success) {
        navigate("/");
      } else {
        // Handle registration failure
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          width: { xs: "90vw", sm: 400 },
          maxWidth: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={2} align="center">
          Join Chrono
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: "100%" }}
          noValidate
        >
          <CustomTextField
            controller={{
              control,
              name: "name",
              errors: errors.name?.message,
            }}
            label="Name"
            type="text"
            required
            placeholder="Enter your name"
            error={!!errors.name}
            sx={{ mb: 2 }}
          />
          <CustomTextField
            controller={{
              control,
              name: "email",
              errors: errors.email?.message,
            }}
            label="Email"
            type="email"
            required
            placeholder="Enter your email"
            error={!!errors.email}
            sx={{ mb: 2 }}
          />
          <CustomTextField
            controller={{
              control,
              name: "password",
              errors: errors.password?.message,
            }}
            label="Password"
            type="password"
            isPassword
            required
            placeholder="Enter your password"
            error={!!errors.password}
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 1, fontWeight: 600 }}
          >
            Register
          </Button>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link component={RouterLink} to="/login" color="primary">
                Login now
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
