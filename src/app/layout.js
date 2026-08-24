// app/layout.js

import { Geist, Geist_Mono, Manrope, Inter } from "next/font/google";
import "./globals.css";
import ToastProvider from "./ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Design-system typefaces: Manrope for headings, Inter for body/UI.
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${inter.variable} antialiased`}
      >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
