import React, { useState } from "react";
import {
  Box,
  Chip,
  TextField,
  Autocomplete,
  Typography,
  FormHelperText
} from "@mui/material";

const defaultTags = [
  { label: "Work", value: "work" },
  { label: "Personal", value: "personal" },
  { label: "University", value: "university" },
  { label: "Meeting", value: "meeting" },
  { label: "Appointment", value: "appointment" },
  { label: "Birthday", value: "birthday" },
  { label: "Holiday", value: "holiday" },
  { label: "Travel", value: "travel" }
];

const TagSelector = ({ value = [], onChange, error, label = "Tags" }) => {
  const [inputValue, setInputValue] = useState("");

  // Ensure value is always an array
  const safeValue = Array.isArray(value) ? value : [];

  const handleChange = (event, newValue) => {
    onChange(newValue || []);
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  return (
    <Box data-testid="tag-selector-root">
      <Autocomplete
        multiple
        freeSolo
        options={defaultTags}
        value={safeValue}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          }
          return option.label || option;
        }}
        isOptionEqualToValue={(option, value) => {
          if (typeof option === "string" && typeof value === "string") {
            return option === value;
          }
          if (typeof option === "object" && typeof value === "object") {
            return option.value === value.value;
          }
          return false;
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const label = typeof option === "string" ? option : option.label;
            return (
              <Chip
                variant="outlined"
                label={label}
                {...getTagProps({ index })}
                key={index}
                onClick={(event) => {
                  // Prevent the default behavior and call onChange directly
                  event.stopPropagation();
                  const newValue = value.filter((_, i) => i !== index);
                  onChange(newValue);
                }}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder="Select or type tags..."
            error={!!error}
            fullWidth
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <Typography>{option.label}</Typography>
          </Box>
        )}
      />
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Box>
  );
};

export default TagSelector;
