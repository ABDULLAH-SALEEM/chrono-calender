import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography,
  FormHelperText,
  Dialog,
  Grid,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomTextField from "./formFields/textField";
import TagSelector from "./TagSelector";

const priorities = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "critical", label: "Critical" },
];

const recurringOptions = [
  { value: "", label: "None" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  start: yup
    .date()
    .typeError("Start date/time is required")
    .required("Start date/time is required"),
  end: yup
    .date()
    .typeError("End date/time is required")
    .required("End date/time is required")
    .min(yup.ref("start"), "End date/time must be after start date/time"),
  priority: yup.string().oneOf(["", "high", "medium", "low", "critical"]),
  recurring: yup.string().oneOf(["", "daily", "weekly", "monthly"]),
  tags: yup.array().of(yup.string()).optional(),
});

export default function EventForm({
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = "Create",
  onDelete, // new prop
}) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: initialValues.title || "",
      description: initialValues.description || "",
      start: initialValues.start || null,
      end: initialValues.end || null,
      priority: initialValues.priority || "",
      recurring: initialValues.recurring || "",
      tags: initialValues.tags || [],
    },
    resolver: yupResolver(schema),
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <Box sx={{ p: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6" mb={2} align="center">
          {submitLabel === "Create" ? "Create New Event" : "Update Event"}
        </Typography>
        <Stack spacing={2}>
          <CustomTextField
            label={"Event title "}
            controller={{
              control,
              name: "title",
              errors: errors.title?.message,
            }}
            placeholder="Event title"
            error={!!errors.title}
          />

          <CustomTextField
            label="Event description"
            controller={{
              control,
              name: "description",
              errors: errors.description?.message,
            }}
            multiline
            minRows={3}
            placeholder="Event description"
            error={!!errors.description}
          />

          <Controller
            name="start"
            control={control}
            render={({ field }) => (
              <>
                <DateTimePicker
                  {...field}
                  label="Start Date/Time"
                  slotProps={{
                    textField: {
                      error: !!errors.start,
                      fullWidth: true,
                    },
                  }}
                />
                {errors.start && (
                  <FormHelperText error>{errors.start.message}</FormHelperText>
                )}
              </>
            )}
          />
          <Controller
            name="end"
            control={control}
            render={({ field }) => (
              <>
                <DateTimePicker
                  {...field}
                  label="End Date/Time"
                  slotProps={{
                    textField: {
                      error: !!errors.end,
                      fullWidth: true,
                    },
                  }}
                />
                {errors.end && (
                  <FormHelperText error>{errors.end.message}</FormHelperText>
                )}
              </>
            )}
          />
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Priority" select fullWidth>
                <MenuItem value="">None</MenuItem>
                {priorities.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="recurring"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Recurring" select fullWidth>
                {recurringOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagSelector
                value={field.value}
                onChange={field.onChange}
                error={errors.tags?.message}
                label="Tags"
              />
            )}
          />
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Grid>
              {submitLabel === "Update" && (
                <Button
                  color="error"
                  variant="contained"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete
                </Button>
              )}
            </Grid>

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button onClick={onCancel} color="error" variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {submitLabel}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </form>
      {/* Confirmation Dialog */}
      {submitLabel === "Update" && (
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <Box p={3}>
            <Typography variant="h6" mb={2}>
              Delete Event
            </Typography>
            <Typography mb={2}>
              Are you sure you want to delete this event?
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  onDelete && onDelete();
                }}
              >
                Delete
              </Button>
            </Stack>
          </Box>
        </Dialog>
      )}
    </Box>
  );
}
