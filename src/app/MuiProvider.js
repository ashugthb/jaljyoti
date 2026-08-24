// app/MuiProvider.js
"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

/**
 * MUI + Emotion, scoped to the routes that still use them (/classic and
 * /admin-dashboard).
 *
 * Two things here are load-bearing for hydration:
 *
 * 1. AppRouterCacheProvider. Without it, Emotion serialises its <style> tags
 *    inline wherever the component happened to render during SSR, while on the
 *    client it inserts them into <head>. React then finds a <style> where it
 *    expected the next element and throws the whole tree away
 *    ("server rendered HTML didn't match the client"). The provider routes the
 *    styles through useServerInsertedHTML so both passes agree.
 *
 * 2. This is no longer mounted at the root. The design-system routes (/, /team,
 *    /gallery) contain no MUI at all now that the icons are our own, so keeping
 *    a theme + CssBaseline above them only shipped Emotion to pages that never
 *    used it — and put the mismatch on every route.
 */
const theme = createTheme({
  palette: {
    primary: { main: "#00695C" },
    secondary: { main: "#FF9800" },
  },
  typography: {
    fontFamily: "var(--font-geist-sans)",
    h4: { fontWeight: 700 },
  },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  },
});

export default function MuiProvider({ children }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
