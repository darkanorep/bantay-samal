import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#0F3D56",
      light: "#2C617A",
      dark: "#082A3C",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#14B8A6",
      light: "#5EEAD4",
      dark: "#0F766E",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#F4F7F9",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#172B35",
      secondary: "#60747D",
    },

    divider: "#DCE5E9",

    error: {
      main: "#D64545",
    },

    warning: {
      main: "#E69B2D",
    },

    success: {
      main: "#2E8B68",
    },

    info: {
      main: "#3182A8",
    },
  },

  typography: {
    fontFamily: ["Inter", "Roboto", "Arial", "sans-serif"].join(","),

    h1: {
      fontWeight: 700,
    },

    h2: {
      fontWeight: 700,
    },

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 700,
    },

    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: "none",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(15, 61, 86, 0.06)",
          border: "1px solid #E2EAEE",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;
