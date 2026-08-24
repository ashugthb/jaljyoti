import MuiProvider from "../MuiProvider";

/**
 * The legacy page is the only consumer of MUI on the public site, so the theme
 * and Emotion are mounted here rather than at the root — that keeps them off
 * "/", "/team" and "/gallery" entirely.
 */
export default function ClassicLayout({ children }) {
  return <MuiProvider>{children}</MuiProvider>;
}
