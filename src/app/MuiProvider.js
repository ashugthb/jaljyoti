// components/MuiProvider.js
"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create your theme on the client side
const theme = createTheme({
    palette: {
        primary: {
            main: '#00695C',
        },
        secondary: {
            main: '#FF9800',
        },
    },
    typography: {
        fontFamily: 'var(--font-geist-sans)',
        h4: {
            fontWeight: 700,
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

export default function MuiProvider({ children }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
            {children}
        </ThemeProvider>
    );
}
