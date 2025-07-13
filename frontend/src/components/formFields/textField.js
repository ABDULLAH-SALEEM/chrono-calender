import React, { useState } from "react";
import { Controller } from "react-hook-form";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { FormHelperText, InputAdornment, TextField } from "@mui/material";

const CustomTextField = ({
  endIcon = false,
  controller,
  isPassword = false,
  label,
  type = "text",
  required = true,
  icon,
  ...props
}) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const togglePassword = () => setIsShowPassword(!isShowPassword);

  const formatValue = (value) => {
    if (!value) return "";

    return value;
  };

  return (
    <div>
      {controller ? (
        <>
          <Controller
            control={controller.control}
            name={controller.name}
            rules={{ required }}
            render={({ field: { onChange, value, onBlur } }) => (
              <TextField
                label={label}
                className="autofill"
                slotProps={{
                  input: {
                    startAdornment: icon && (
                      <InputAdornment position="start">{icon}</InputAdornment>
                    ),
                    endAdornment: isPassword ? (
                      <InputAdornment
                        sx={{ cursor: "pointer" }}
                        onClick={togglePassword}
                        position="end"
                      >
                        {!isShowPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </InputAdornment>
                    ) : (
                      endIcon
                    )
                  }
                }}
                fullWidth
                type={isShowPassword ? "text" : type}
                onChange={onChange}
                error={Boolean(controller.errors)}
                value={formatValue(value, type)}
                onBlur={onBlur}
                {...props}
              />
            )}
          />
          {controller.errors && (
            <FormHelperText sx={{ color: "error.main" }}>
              {controller.errors}
            </FormHelperText>
          )}
        </>
      ) : (
        <TextField
          type={type}
          fullWidth
          size="small"
          slotProps={{
            input: {
              startAdornment: icon && (
                <InputAdornment position="start">{icon}</InputAdornment>
              ),
              endAdornment: isPassword ? (
                <InputAdornment
                  sx={{ cursor: "pointer" }}
                  onClick={togglePassword}
                  position="end"
                >
                  {!isShowPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </InputAdornment>
              ) : (
                endIcon
              )
            }
          }}
          {...props}
        />
      )}
    </div>
  );
};

export default CustomTextField;
