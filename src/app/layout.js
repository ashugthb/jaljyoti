// app/layout.js

// Using generic system fonts to avoid fetching Google Fonts during build
import "./globals.css";
import MuiProvider from "./MuiProvider"; // adjust the path if necessary


export const metadata = {
  title: "Jaljyoti",
  description: "Jaljyoti",
  icons: {
    icon: "/logo.jpg", // Reference to your favicon in the public folder
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <MuiProvider>{children}</MuiProvider>
      </body>
    </html>
  );
}
