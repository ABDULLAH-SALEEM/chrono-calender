import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000", // Black
      contrastText: "#ffffff" // White text on primary
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: "#000000",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#222222"
          }
        },
        outlinedPrimary: {
          borderColor: "#000000",
          color: "#000000",
          "&:hover": {
            backgroundColor: "rgba(0,0,0,0.04)",
            borderColor: "#000000"
          }
        }
      }
    }
  }
});

export default theme;
