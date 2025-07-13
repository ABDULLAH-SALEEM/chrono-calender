import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Paper,
  Typography,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid
} from "@mui/material";
import CustomTextField from "../components/formFields/textField";
import { authService } from "../services/apis";
import { useAuth } from "../hooks/useAuth";

const SettingsPage = () => {
  const { user } = useAuth();
  // Change Password Form
  const {
    handleSubmit: handlePasswordSubmit,
    control: passwordControl,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors }
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    }
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  const onChangePassword = async (data) => {
    setPasswordLoading(true);
    setPasswordMsg("");
    if (data.newPassword !== data.confirmNewPassword) {
      setPasswordMsg("New passwords do not match.");
      setPasswordLoading(false);
      return;
    }
    try {
      await authService.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      setPasswordMsg("Password updated successfully.");
      resetPasswordForm();
    } catch (err) {
      setPasswordMsg(
        err?.response?.data?.message || "Failed to update password."
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  // Timezone Form
  const {
    handleSubmit: handleTimezoneSubmit,
    control: timezoneControl,
    formState: { errors: timezoneErrors }
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      timezone: user?.timezone || "Europe/Berlin"
    }
  });
  const [timezoneMsg, setTimezoneMsg] = useState("");
  const [timezoneLoading, setTimezoneLoading] = useState(false);

  const onChangeTimezone = async (data) => {
    try {
      setTimezoneLoading(true);
      setTimezoneMsg("");
      await authService.updateTimezone(data);
      setTimezoneMsg("Timezone updated successfully.");
    } catch (err) {
      setTimezoneMsg(
        err?.response?.data?.message || "Failed to update timezone."
      );
    } finally {
      setTimezoneLoading(false);
    }
  };

  return (
    <Box>
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          mx: "auto",
          mb: 4,
          p: { xs: 2, sm: 4 }
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={2}>
          Change Password
        </Typography>
        <Box
          component="form"
          onSubmit={handlePasswordSubmit(onChangePassword)}
          sx={{ width: "100%" }}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, md: 4 }}>
              <CustomTextField
                controller={{
                  control: passwordControl,
                  name: "currentPassword",
                  errors: passwordErrors.currentPassword?.message
                }}
                label="Current Password"
                type="password"
                isPassword
                required
                placeholder="Enter current password"
                error={!!passwordErrors.currentPassword}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <CustomTextField
                controller={{
                  control: passwordControl,
                  name: "newPassword",
                  errors: passwordErrors.newPassword?.message
                }}
                label="New Password"
                type="password"
                isPassword
                required
                placeholder="Enter new password"
                error={!!passwordErrors.newPassword}
              />
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }}>
              <CustomTextField
                controller={{
                  control: passwordControl,
                  name: "confirmNewPassword",
                  errors: passwordErrors.confirmNewPassword?.message
                }}
                label="Confirm New Password"
                type="password"
                isPassword
                required
                placeholder="Confirm new password"
                error={!!passwordErrors.confirmNewPassword}
              />
            </Grid>

            {passwordMsg && (
              <Typography
                color={
                  passwordMsg.includes("success")
                    ? "success.main"
                    : "error.main"
                }
              >
                {passwordMsg}
              </Typography>
            )}
            <Grid item size={{ xs: 12, md: 2.5 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={passwordLoading}
                sx={{ fontWeight: 600 }}
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper
        elevation={2}
        sx={{
          width: "100%",

          mx: "auto",
          p: { xs: 2, sm: 4 }
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={2}>
          Preferred Timezone
        </Typography>
        <Box
          component="form"
          onSubmit={handleTimezoneSubmit(onChangeTimezone)}
          sx={{ width: "100%" }}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth error={!!timezoneErrors.timezone}>
                <InputLabel id="timezone-label">Timezone</InputLabel>
                <Controller
                  name="timezone"
                  control={timezoneControl}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="timezone-label"
                      label="Timezone"
                    >
                      {Intl.supportedValuesOf("timeZone").map((tz) => (
                        <MenuItem key={tz} value={tz}>
                          {tz}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {timezoneErrors.timezone && (
                  <FormHelperText>
                    {timezoneErrors.timezone.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item size={{ md: 8 }} />
            {timezoneMsg && (
              <Typography
                color={
                  timezoneMsg.includes("updated")
                    ? "success.main"
                    : "error.main"
                }
              >
                {timezoneMsg}
              </Typography>
            )}
            <Grid item size={{ xs: 12, md: 2.5 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={timezoneLoading}
                sx={{ fontWeight: 600 }}
              >
                {timezoneLoading ? "Updating..." : "Update Timezone"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default SettingsPage;
