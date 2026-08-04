// components/MuiProvider.js
"use client";

import dynamic from "next/dynamic";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css";

// react-toastify's container mounts real DOM only on the client (there's
// nothing to toast during a server render), so its SSR output and first
// client render never match — a guaranteed hydration mismatch. Disabling SSR
// for it entirely sidesteps the mismatch instead of masking it.
const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

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
