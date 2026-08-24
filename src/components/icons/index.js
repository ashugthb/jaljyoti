/**
 * Jaljyoti animated icon set — 36 stroke-drawn SVG icons on a 24x24 grid.
 *
 * All motion is CSS-only (see the "Animated icon system" block in globals.css)
 * and is switched off wholesale under `prefers-reduced-motion: reduce`.
 *
 * Triggers, set with the `play` prop:
 *   (default)  animate on hover/focus of the icon or its nearest `.group`
 *   "always"   animate continuously — for live indicators and loaders
 *   "view"     animate once the surrounding <Reveal> scrolls into view
 */
export { default as IconBase } from "./IconBase";

export {
  WaterDropIcon,
  TestStripIcon,
  BeakerIcon,
  DnaIcon,
  DropperIcon,
  TimerIcon,
  MoleculeIcon,
  FilterIcon,
  MicrobeIcon,
  MicroscopeIcon,
  LeafIcon,
  PulseIcon,
} from "./science";

export {
  CheckCircleIcon,
  CheckIcon,
  WarningIcon,
  CrisisAlertIcon,
  ShieldCheckIcon,
  DoneAllIcon,
  SparkleIcon,
  SpinnerIcon,
  ClockIcon,
} from "./status";

export {
  ArrowRightIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuIcon,
  CloseIcon,
  PlayIcon,
  ExpandIcon,
  PhoneIcon,
  MailIcon,
  LocationIcon,
  SchoolIcon,
  AwardIcon,
  GroupsIcon,
  FactoryIcon,
} from "./ui";
