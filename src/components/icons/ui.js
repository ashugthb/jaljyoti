import IconBase from "./IconBase";

/**
 * Navigation, contact and credential icons. These sit on controls, so their
 * motion is deliberately smaller than the domain set: a nudge in the direction
 * of travel, not a performance.
 */

export function ArrowRightIcon(props) {
  return (
    <IconBase {...props}>
      <g className="jj-ia-nudge-x">
        <path d="M3.4 12h15.8" />
        <path d="m13.2 6.2 6 5.8-6 5.8" />
      </g>
    </IconBase>
  );
}

export function ArrowUpIcon(props) {
  return (
    <IconBase {...props}>
      <g className="jj-ia-nudge-up">
        <path d="M12 20.4V4.4" />
        <path d="m5.8 10.6 6.2-6.2 6.2 6.2" />
      </g>
    </IconBase>
  );
}

export function ChevronDownIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m5.6 9 6.4 6.4L18.4 9" className="jj-ia-nudge-down" />
    </IconBase>
  );
}

export function ChevronLeftIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M14.6 5.6 8.2 12l6.4 6.4" className="jj-ia-nudge-left" />
    </IconBase>
  );
}

export function ChevronRightIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M9.4 5.6 15.8 12l-6.4 6.4" className="jj-ia-nudge-x" />
    </IconBase>
  );
}

/** Hamburger. Pass `open` to morph it into a close mark. */
export function MenuIcon({ open = false, ...props }) {
  return (
    <IconBase data-open={open ? "true" : "false"} {...props}>
      <path d="M3.6 6.8h16.8" className="jj-im-bar-top" />
      <path d="M3.6 12h16.8" className="jj-im-bar-mid" />
      <path d="M3.6 17.2h16.8" className="jj-im-bar-bottom" />
    </IconBase>
  );
}

export function CloseIcon(props) {
  return (
    <IconBase {...props}>
      <g className="jj-ia-rotate-in">
        <path d="m5.8 5.8 12.4 12.4" />
        <path d="m18.2 5.8-12.4 12.4" />
      </g>
    </IconBase>
  );
}

/** Play control with a ring that breathes outward. */
export function PlayIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9.6" className="jj-ia-wave-1" />
      <path d="M9.4 6.9 17.6 12l-8.2 5.1z" fill="currentColor" className="jj-ia-pop" />
    </IconBase>
  );
}

/** Expand to full screen — the corners push outward. */
export function ExpandIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M9 3.4H3.4v5.6" className="jj-ia-corner-tl" />
      <path d="M15 3.4h5.6v5.6" className="jj-ia-corner-tr" />
      <path d="M20.6 15v5.6H15" className="jj-ia-corner-br" />
      <path d="M9 20.6H3.4V15" className="jj-ia-corner-bl" />
    </IconBase>
  );
}

/** Handset that rings — the arcs radiate on hover. */
export function PhoneIcon(props) {
  return (
    <IconBase {...props}>
      <path
        d="M5.6 3.4h3l1.5 3.8-1.9 1.1a10.4 10.4 0 0 0 5.1 5.1l1.1-1.9 3.8 1.5v3a1.8 1.8 0 0 1-2 1.8A14.9 14.9 0 0 1 3.8 5.4a1.8 1.8 0 0 1 1.8-2Z"
        className="jj-ia-draw"
        pathLength="1"
      />
      <path d="M15.2 5.4a3.6 3.6 0 0 1 3.4 3.4" className="jj-ia-wave-1" />
      <path d="M15 2.4a6.5 6.5 0 0 1 6.4 6.4" className="jj-ia-wave-2" />
    </IconBase>
  );
}

/** Envelope whose flap opens. */
export function MailIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="2.6" y="4.8" width="18.8" height="14.4" rx="2.4" className="jj-ia-draw" pathLength="1" />
      <path d="m3.6 6.4 8.4 6 8.4-6" className="jj-ia-flap" />
    </IconBase>
  );
}

/** Map pin that drops onto a ripple. */
export function LocationIcon(props) {
  return (
    <IconBase {...props}>
      <g className="jj-ia-drop-in">
        <path
          d="M12 21.2s7-5.6 7-10.8a7 7 0 1 0-14 0c0 5.2 7 10.8 7 10.8Z"
          className="jj-ia-draw"
          pathLength="1"
        />
        <circle cx="12" cy="10.2" r="2.5" />
      </g>
      <ellipse cx="12" cy="21.6" rx="4.2" ry="1.1" className="jj-ia-ripple" />
    </IconBase>
  );
}

/** Mortarboard with a swinging tassel — academic affiliation. */
export function SchoolIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M2.6 8.6 12 4.2l9.4 4.4-9.4 4.4z" className="jj-ia-draw" pathLength="1" />
      <path d="M6.6 10.8v4.4c0 1.8 2.4 3.2 5.4 3.2s5.4-1.4 5.4-3.2v-4.4" />
      <path d="M21.4 8.6v5.2" className="jj-ia-tassel" />
    </IconBase>
  );
}

/** Trophy with a sparkle burst. */
export function AwardIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M7.6 3.4h8.8v5a4.4 4.4 0 1 1-8.8 0z" className="jj-ia-draw" pathLength="1" />
      <path d="M7.6 5h-2.8v1.4a3.4 3.4 0 0 0 2.9 3.4" />
      <path d="M16.4 5h2.8v1.4a3.4 3.4 0 0 1-2.9 3.4" />
      <path d="M12 12.8v3.4" />
      <path d="M8.8 20.6h6.4l-.8-4.4H9.6z" />
      <path d="M18.4 12.6v2.4M17.2 13.8h2.4" className="jj-ia-twinkle" />
    </IconBase>
  );
}

/** Three figures that arrive in sequence — community / field deployment. */
export function GroupsIcon(props) {
  return (
    <IconBase {...props}>
      <g className="jj-ia-pop-1">
        <circle cx="9" cy="8.4" r="3.1" />
        <path d="M3.2 19.4a5.8 5.8 0 0 1 11.6 0" />
      </g>
      <g className="jj-ia-pop-2">
        <circle cx="17.2" cy="9.6" r="2.3" />
        <path d="M15.6 14.4a4.8 4.8 0 0 1 5.2 4.6" />
      </g>
    </IconBase>
  );
}

/** Plant with smoke drifting up — industrial / municipal supply. */
export function FactoryIcon(props) {
  return (
    <IconBase {...props}>
      <path
        d="M2.6 21.4V10.8l6 3.6v-3.6l6 3.6V6.6h6.8v14.8z"
        className="jj-ia-draw"
        pathLength="1"
      />
      <path d="M7 18.2h2M12.4 18.2h2M17.6 18.2h2" opacity="0.55" />
      <circle cx="17.8" cy="4" r="1.1" className="jj-ia-smoke-1" />
      <circle cx="20.4" cy="3.2" r="0.8" className="jj-ia-smoke-2" />
    </IconBase>
  );
}
