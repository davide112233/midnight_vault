import { Creepster } from "next/font/google";
import { createTheme } from "@mui/material";

export const creepster = Creepster({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
});

export const theme = createTheme({
  typography: {
    fontFamily: '"Creepster", cursive, sans-serif',
  },
  palette: {
    mode: "light",
    primary: {
      main: "#d50000",
    },
    secondary: {
      main: "#ffffff",
    },
    text: {
      primary: "#ffffff",
    },
    background: {
      paper: "#080808",
    },
  },
});
