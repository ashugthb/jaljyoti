// components/MuiProvider.js
"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

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
            {children}
        </ThemeProvider>
    );
}
