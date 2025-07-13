import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Chip,
  Typography,
  useTheme,
  useMediaQuery
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";

const EventSearch = ({
  events = [],
  onEventSelect,
  placeholder = "Search events..."
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Filter events based on search query
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredEvents([]);
      return;
    }

    const query = searchValue.toLowerCase();
    const filtered = events.filter((event) => {
      // Search in title
      if (event.title?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in description
      if (event.description?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in tags
      if (event.tags && Array.isArray(event.tags)) {
        return event.tags.some((tag) => tag.toLowerCase().includes(query));
      }

      return false;
    });

    setFilteredEvents(filtered);
  }, [searchValue, events]);

  const handleEventSelect = (event) => {
    if (event) {
      onEventSelect(event);
      setSearchValue("");
    }
  };

  const formatEventTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    );
  };

  const getEventPreview = (event) => {
    const timeStr = formatEventTime(event.start);
    const tagsStr =
      event.tags && event.tags.length > 0
        ? ` • ${event.tags.slice(0, 2).join(", ")}${event.tags.length > 2 ? "..." : ""}`
        : "";

    return `${timeStr}${tagsStr}`;
  };

  return (
    <Box
      sx={{
        width: isMobile ? "100%" : "300px",
        position: "relative"
      }}
    >
      <Autocomplete
        freeSolo
        options={filteredEvents}
        getOptionLabel={(option) => {
          if (typeof option === "string") return option;
          return option.title || "";
        }}
        inputValue={searchValue}
        onInputChange={(event, newInputValue) => {
          setSearchValue(newInputValue);
        }}
        onChange={(event, newValue) => {
          handleEventSelect(newValue);
        }}
        filterOptions={(x) => x} // Disable built-in filtering since we handle it manually
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant="outlined"
            size="small"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
              )
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "background.paper",
                "&:hover": {
                  backgroundColor: "action.hover"
                }
              }
            }}
          />
        )}
        renderOption={(props, option) => (
          <Box component="li" {...props} sx={{ py: 1 }}>
            <Box
              sx={{ display: "flex", alignItems: "flex-start", width: "100%" }}
            >
              <EventIcon sx={{ mr: 1, mt: 0.5, color: "primary.main" }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>
                  {option.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {getEventPreview(option)}
                </Typography>
                {option.tags && option.tags.length > 0 && (
                  <Box
                    sx={{
                      mt: 0.5,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5
                    }}
                  >
                    {option.tags.slice(0, 3).map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{
                          height: "20px",
                          fontSize: "0.7rem",
                          "& .MuiChip-label": { px: 1 }
                        }}
                      />
                    ))}
                    {option.tags.length > 3 && (
                      <Chip
                        label={`+${option.tags.length - 3}`}
                        size="small"
                        variant="outlined"
                        sx={{
                          height: "20px",
                          fontSize: "0.7rem",
                          "& .MuiChip-label": { px: 1 }
                        }}
                      />
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
        noOptionsText={
          searchValue.trim() ? "No events found" : "Type to search events..."
        }
        sx={{
          "& .MuiAutocomplete-paper": {
            maxHeight: "300px"
          }
        }}
      />
    </Box>
  );
};

export default EventSearch;
