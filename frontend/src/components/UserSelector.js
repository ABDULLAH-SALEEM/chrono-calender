import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Chip,
  Box,
  CircularProgress
} from "@mui/material";
import { userService } from "../services/apis";

export default function UserSelector({
  value = [],
  onChange,
  error,
  label = "Invite Users"
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Ensure value is always an array
  const safeValue = Array.isArray(value) ? value : [];

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await userService.getAllUsers();
        const userOptions =
          response.data?.map((user) => ({
            value: user.id,
            label: user.name || user.email
          })) || [];
        setUsers(userOptions);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (event, newValue) => {
    onChange(newValue || []);
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  return (
    <Autocomplete
      data-testid="user-selector-root"
      multiple
      options={users}
      value={safeValue}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            label={option.label}
            {...getTagProps({ index })}
            key={option.value}
            onClick={(event) => {
              // Prevent the default behavior and call onChange directly
              event.stopPropagation();
              const newValue = value.filter((_, i) => i !== index);
              onChange(newValue);
            }}
          />
        ))
      }
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          {option.label}
        </Box>
      )}
    />
  );
}
