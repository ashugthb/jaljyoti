import IconBase from "./IconBase";

/**
 * Domain icons — the water-testing story. These carry the most narrative
 * weight on the page, so each one animates the thing it depicts: the droplet
 * ripples, the strip develops its bands, the reagent bubbles, the helix
 * unzips, the timer sweeps.
 */

/** Droplet with a surface ripple underneath it. */
export function WaterDropIcon(props) {
  return (
    <IconBase {...props}>
      <path
        d="M12 3.4c3.5 4.1 5.3 7 5.3 9.2a5.3 5.3 0 1 1-10.6 0c0-2.2 1.8-5.1 5.3-9.2Z"
        className="jj-ia-draw"
        pathLength="1"
      />
      <path d="M9.5 13.4a2.5 2.5 0 0 0 2.5 2.5" className="jj-ia-glint" />
      <ellipse cx="12" cy="20" rx="5.2" ry="1.5" className="jj-ia-ripple" />
    </IconBase>
  );
}

/** Paper test strip whose three reagent bands develop in sequence. */
export function TestStripIcon(props) {
  return (
    <IconBase {...props}>
      {/* Tilted and dipped: upright with bars across it, this silhouette is
          a battery. The angle and the water line are what make it a strip. */}
      <g transform="rotate(-18 12 12)">
        <rect
          x="9"
          y="1.8"
          width="6"
          height="15.4"
          rx="1.6"
          className="jj-ia-draw"
          pathLength="1"
        />
        <path d="M10.6 5.6h2.8" strokeWidth="2" className="jj-ia-band-1" />
        <path d="M10.6 8.6h2.8" strokeWidth="2" className="jj-ia-band-2" />
        <path d="M10.6 11.6h2.8" strokeWidth="2" className="jj-ia-band-3" />
      </g>
      <path d="M2.8 19.4c1.9 1.6 3.8 1.6 5.7 0s3.8-1.6 5.7 0 3.8 1.6 5.7 0" />
    </IconBase>
  );
}

/** Conical flask with a liquid line and rising bubbles. */
export function BeakerIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M8 2.8h8" />
      <path
        d="M9.4 2.8v5.6L4.9 17a2.4 2.4 0 0 0 2.1 3.6h10a2.4 2.4 0 0 0 2.1-3.6l-4.5-8.6V2.8"
        className="jj-ia-draw"
        pathLength="1"
      />
      <path d="M6.6 15h10.8" opacity="0.55" />
      <circle cx="10.2" cy="17.4" r="0.9" className="jj-ia-bubble-1" />
      <circle cx="13.4" cy="18" r="0.7" className="jj-ia-bubble-2" />
    </IconBase>
  );
}

/** DNA double helix — the rungs light up in sequence, reading as rotation. */
export function DnaIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M7 2.6c0 4.4 10 5.4 10 9.4s-10 5-10 9.4" />
      <path d="M17 2.6c0 4.4-10 5.4-10 9.4s10 5 10 9.4" />
      <path d="M7.7 4.4h8.6" className="jj-ia-rung-1" />
      <path d="M8.7 9.5h6.7" className="jj-ia-rung-2" />
      <path d="M8.7 14.5h6.7" className="jj-ia-rung-3" />
      <path d="M7.7 19.6h8.6" className="jj-ia-rung-4" />
    </IconBase>
  );
}

/** Pipette releasing a drop. */
export function DropperIcon(props) {
  return (
    <IconBase {...props}>
      {/* The bulb has to be visibly wider than the barrel, or the whole thing
          reads as a marker pen. */}
      <path d="M9.2 2.6h5.6a1.4 1.4 0 0 1 1.4 1.4v2.6a1.4 1.4 0 0 1-1.4 1.4H9.2A1.4 1.4 0 0 1 7.8 6.6V4a1.4 1.4 0 0 1 1.4-1.4Z" />
      <path
        d="M10.3 8.4h3.4v5.8L12 17.4l-1.7-3.2z"
        className="jj-ia-draw"
        pathLength="1"
      />
      <path d="M10.5 12.2h3" opacity="0.55" />
      <path
        d="M12 19.2c.85.95 1.27 1.6 1.27 2.05a1.27 1.27 0 1 1-2.54 0c0-.45.42-1.1 1.27-2.05Z"
        className="jj-ia-fall"
      />
    </IconBase>
  );
}

/** Kitchen timer with a sweeping hand. */
export function TimerIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M9.4 2.6h5.2" />
      <path d="M12 2.6v3.4" />
      <circle cx="12" cy="13.6" r="7.8" className="jj-ia-draw" pathLength="1" />
      <path d="M12 13.6V9.2" className="jj-ia-sweep" />
    </IconBase>
  );
}

/** Molecule — three orbital shells turning around a nucleus. */
export function MoleculeIcon(props) {
  return (
    <IconBase {...props}>
      <g className="jj-ia-orbit">
        <ellipse cx="12" cy="12" rx="9.6" ry="3.9" />
        <ellipse cx="12" cy="12" rx="9.6" ry="3.9" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9.6" ry="3.9" transform="rotate(120 12 12)" />
      </g>
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

/** Funnel with a droplet passing through — filtration / purification. */
export function FilterIcon(props) {
  return (
    <IconBase {...props}>
      <path
        d="M3.6 4h16.8l-6.6 7.6v5.5L10.2 19.4v-7.8z"
        className="jj-ia-draw"
        pathLength="1"
      />
      <path
        d="M12 20.4c.68.76 1.02 1.29 1.02 1.65a1.02 1.02 0 1 1-2.04 0c0-.36.34-.89 1.02-1.65Z"
        className="jj-ia-fall"
      />
    </IconBase>
  );
}

/** Microbe — the thing being detected. Drifts and its nuclei pulse. */
export function MicrobeIcon(props) {
  return (
    <IconBase {...props}>
      <g className="jj-ia-wobble">
        <path d="M12.6 4.6c4 .3 7 3.8 6.8 7.8-.3 4-3.8 7-7.8 6.8-4-.3-7-3.8-6.8-7.8.3-4 3.8-7 7.8-6.8Z" />
        <path d="M12 2.6v2M12 19.4v2M2.6 12h2M19.4 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
      </g>
      <circle cx="10.2" cy="10.8" r="1.3" className="jj-ia-nucleus-1" />
      <circle cx="14" cy="13.6" r="1" className="jj-ia-nucleus-2" />
    </IconBase>
  );
}

/** Microscope with a scanning highlight across the lens. */
export function MicroscopeIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M5.6 21h13" />
      <path d="M9.4 17.6h6.8" />
      <path d="M13 17.6a5.6 5.6 0 0 0 1-11" className="jj-ia-draw" pathLength="1" />
      <path d="m11.4 3.4-3.6 3.6 3 3 3.6-3.6z" />
      <path d="m8.6 8.2-1.8 1.8" />
      <path d="M8.6 13.4h3.2" className="jj-ia-scan" />
    </IconBase>
  );
}

/** Leaf — sustainability / clean-water outcomes. */
export function LeafIcon(props) {
  return (
    <IconBase {...props}>
      <g className="jj-ia-sway">
        <path
          d="M4.6 19.4C4.6 11 10.2 5.6 19.6 4.4c1 9.4-4.4 15-12.8 15H4.6Z"
          className="jj-ia-draw"
          pathLength="1"
        />
        <path d="M8.6 15.4c2.4-3.6 5.6-6.1 9.4-7.4" />
      </g>
    </IconBase>
  );
}

/** Heartbeat trace — "live" / active monitoring. */
export function PulseIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M2.6 12h4l2.2-5.6 3.6 11.2 2.4-5.6h6.6" className="jj-ia-trace" pathLength="1" />
    </IconBase>
  );
}
