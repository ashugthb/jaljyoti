import IconBase from "./IconBase";

/**
 * Feedback icons. The success / warning / danger trio is what the simulator
 * swaps between, so each one draws itself on arrival rather than popping in —
 * the stroke-draw is what makes a state change read as a *result* landing.
 */

/** Success — the ring draws, then the tick. */
export function CheckCircleIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" className="jj-ia-draw" pathLength="1" />
      <path d="m8 12.2 2.8 2.8 5.4-5.6" className="jj-ia-draw-late" pathLength="1" />
    </IconBase>
  );
}

/** Lighter-weight success mark for list rows. */
export function CheckIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m4.6 12.6 4.6 4.6L19.4 6.8" className="jj-ia-draw" pathLength="1" />
    </IconBase>
  );
}

/** Caution — the triangle draws and the bar blinks. */
export function WarningIcon(props) {
  return (
    <IconBase {...props}>
      <path
        d="M13.4 4.2 21.9 19a1.6 1.6 0 0 1-1.4 2.4H3.5A1.6 1.6 0 0 1 2.1 19l8.5-14.8a1.6 1.6 0 0 1 2.8 0Z"
        className="jj-ia-draw"
        pathLength="1"
      />
      <path d="M12 9.6v4.2" className="jj-ia-blink" />
      <path d="M12 17.4h.01" strokeWidth="2.2" className="jj-ia-blink" />
    </IconBase>
  );
}

/** Danger — a contact point with alert rings pushing outward. */
export function CrisisAlertIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="6" className="jj-ia-wave-1" />
      <circle cx="12" cy="12" r="9.4" className="jj-ia-wave-2" />
    </IconBase>
  );
}

/** Verified / certified. */
export function ShieldCheckIcon(props) {
  return (
    <IconBase {...props}>
      <path
        d="M12 2.6 20 5.4v6c0 4.8-3.2 8.6-8 10-4.8-1.4-8-5.2-8-10v-6z"
        className="jj-ia-draw"
        pathLength="1"
      />
      <path d="m8.8 11.8 2.3 2.3 4.3-4.5" className="jj-ia-draw-late" pathLength="1" />
    </IconBase>
  );
}

/** Double tick — "compare and confirm". */
export function DoneAllIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m1.6 13 3.6 3.6 7.2-7.2" className="jj-ia-draw" pathLength="1" />
      <path d="m8.6 16.6 1.8 1.8L20.6 8.2" className="jj-ia-draw-late" pathLength="1" />
    </IconBase>
  );
}

/** Four-point star with a smaller twinkling companion. */
export function SparkleIcon(props) {
  return (
    <IconBase {...props}>
      <path
        d="M10.4 2.8c.9 4.4 2.3 5.8 6.7 6.7-4.4.9-5.8 2.3-6.7 6.7-.9-4.4-2.3-5.8-6.7-6.7 4.4-.9 5.8-2.3 6.7-6.7Z"
        className="jj-ia-draw"
        pathLength="1"
      />
      <path
        d="M18 14.6c.4 2 1.1 2.7 3.1 3.1-2 .4-2.7 1.1-3.1 3.1-.4-2-1.1-2.7-3.1-3.1 2-.4 2.7-1.1 3.1-3.1Z"
        className="jj-ia-twinkle"
      />
    </IconBase>
  );
}

/** Indeterminate loader — always in motion by design. */
export function SpinnerIcon({ play = "always", ...props }) {
  return (
    <IconBase play={play} {...props}>
      <circle cx="12" cy="12" r="9" opacity="0.22" />
      <path d="M21 12a9 9 0 0 0-9-9" className="jj-ia-spin" />
    </IconBase>
  );
}

/** Clock with independently ticking hands. */
export function ClockIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" className="jj-ia-draw" pathLength="1" />
      <path d="M12 12V7.2" className="jj-ia-hand-minute" />
      <path d="M12 12h3.4" className="jj-ia-hand-hour" />
    </IconBase>
  );
}
