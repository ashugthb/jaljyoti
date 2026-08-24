import MuiProvider from "../MuiProvider";

/** The dashboard is built entirely from MUI components. */
export default function AdminDashboardLayout({ children }) {
  return <MuiProvider>{children}</MuiProvider>;
}
