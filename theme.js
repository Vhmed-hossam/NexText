import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "var(--font-roboto)",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#635EE2",
        },
        secondary: {
          main: "#A8DBFA",
        },
        background: {
          default: "#F1FFF4",
        },
      },
    },
  },
});

export default theme;