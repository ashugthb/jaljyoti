/**
 * Shared chassis for the Jaljyoti animated icon set.
 *
 * Every icon in this folder is a stroke-drawn 24x24 SVG that inherits its
 * colour from `currentColor`, so a single Tailwind text-* utility recolours it.
 * Motion lives entirely in globals.css (the `jj-ia-*` classes + `jj-ik-*`
 * keyframes) rather than in JS: no runtime, no per-frame React work, and
 * `prefers-reduced-motion` switches all of it off in one place.
 *
 * `sx={{ fontSize }}` is accepted alongside `size` purely so these are literal
 * drop-ins at the call sites that used to render MUI icons.
 */
export default function IconBase({
  size,
  sx,
  strokeWidth = 1.6,
  className = "",
  title,
  play,
  viewBox = "0 0 24 24",
  children,
  ...rest
}) {
  const px = size ?? sx?.fontSize ?? 24;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={px}
      height={px}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-play={play}
      className={`jj-i ${className}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
