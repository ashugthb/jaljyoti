// app/ToastProvider.js
"use client";

import dynamic from "next/dynamic";
import "react-toastify/dist/ReactToastify.css";

/**
 * Toast host for the whole site — the enquiry dialog (GetStarted) reports
 * success and failure through it, so it has to sit above every route.
 *
 * react-toastify mounts real DOM only on the client (there is nothing to toast
 * during a server render), so its SSR output and first client render never
 * match. Disabling SSR for it sidesteps the mismatch rather than masking it.
 */
const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

export default function ToastProvider() {
  return (
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
  );
}
