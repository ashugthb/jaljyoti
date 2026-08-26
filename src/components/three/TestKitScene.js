"use client";

import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  Float,
  Preload,
  RoundedBox,
} from "@react-three/drei";
import { damp3, dampE } from "maath/easing";
import { suspend } from "suspend-react";
import { Color, DoubleSide, Vector3 } from "three";

/**
 * The Jaljyoti test kit: a scroll-scrubbed camera walkthrough, and a
 * reconstruction entry that builds the product out of its individual parts.
 *
 * Every mesh registers itself into a flat part registry by name, so the entry
 * timeline can address fourteen separate pieces — down to each colour-chart
 * swatch and each indicator pad on the strip — rather than moving five welded
 * groups around.
 */

const APARTMENT_HDRI = import("@pmndrs/assets/hdri/apartment.exr");

/** Brand palette, taken verbatim from the design tokens in globals.css. */
const TEAL = "#005c55";
const TEAL_BRIGHT = "#0f766e";
const AQUA = "#80d5cb";
const BLUE = "#5bb8fe";
const PAPER = "#f6f4ec";

const CHART_SWATCHES = ["#9cf2e8", "#5bb8fe", "#ffb84d", "#e2574c"];

/**
 * Camera waypoints.
 *
 * The rule here is one focal length. The previous set ran from 6.2 units out to
 * 2.4 — the subject more than doubled in size between beats, which is a zoom,
 * and a zoom on every step is what makes a product film look like a slideshow.
 * Every waypoint below sits 4.75-4.89 from its own target: a 3% spread, i.e. a
 * locked lens. The camera arcs around the kit and tilts to follow the action,
 * and the subject stays the same size throughout.
 *
 * Targets rise and fall with what is happening — up to the mouth for the pour
 * and the dip, back down for the wait, across for the comparison. That is a pan
 * and tilt on a fixed lens, which is what an operator would actually do.
 */
const WAYPOINTS = [
  { position: [0.25, 0.62, 4.86], target: [0, 0.1, 0] },
  { position: [1.15, 1.32, 4.62], target: [0, 0.82, 0] },
  { position: [0.4, 1.12, 4.74], target: [0, 0.68, 0] },
  { position: [-1.0, 0.56, 4.72], target: [0, 0.12, 0] },
  { position: [1.6, 0.34, 4.66], target: [0.82, -0.12, 0] },
];

/**
 * The reconstruction.
 *
 * `from` is where the piece begins, as an offset from its authored transform.
 * `spin` is the extra rotation it carries in. `at` is when it starts, and
 * `swing` bends its path: each axis is tweened on its own duration and ease, so
 * a piece arcs into place instead of travelling down a straight line. That
 * separation is the whole trick — matched durations produce a slide, mismatched
 * ones produce a curve.
 *
 * Order is the assembly order of the real thing: the vessel first, then what
 * goes in it, then what seals it, then the parts you read it with.
 */
const ASSEMBLY = [
  { key: "vialBase", from: [0.4, -3.4, -1.4], spin: [1.4, 2.2, 0.8], at: 0.0, swing: 1.25 },
  { key: "vialBody", from: [-0.6, 3.6, -1.8], spin: [-1.1, 2.8, 0.6], at: 0.12, swing: 1.15 },
  { key: "reagent", from: [0, 3.2, 0], spin: [0, -2.4, 0], at: 0.62, swing: 0.85 },
  { key: "meniscus", from: [0, 1.9, 0], spin: [0.9, 0, 0], at: 0.86, swing: 0.7 },
  { key: "capRing", from: [1.9, 2.6, 1.5], spin: [1.8, -2.6, 1.2], at: 0.98, swing: 1.1 },
  { key: "capTop", from: [-1.7, 3.4, 1.2], spin: [-1.5, 3.1, -0.9], at: 1.12, swing: 1.1 },
  { key: "stripBody", from: [-3.4, 1.2, 1.6], spin: [0.6, 1.4, -1.9], at: 1.26, swing: 1.2 },
  { key: "stripPadA", from: [-2.2, -1.8, 1.9], spin: [1.2, -1.6, 0.7], at: 1.44, swing: 0.8 },
  { key: "stripPadB", from: [-2.6, -1.2, 1.7], spin: [-0.9, 1.9, 0.5], at: 1.5, swing: 0.8 },
  { key: "chartCard", from: [3.8, -0.6, -1.9], spin: [0.4, 2.6, -1.1], at: 1.4, swing: 1.25 },
  { key: "swatch0", from: [2.6, 2.2, 1.4], spin: [1.5, -1.2, 0.9], at: 1.66, swing: 0.75 },
  { key: "swatch1", from: [3.0, 1.5, 1.6], spin: [-1.3, 1.4, -0.8], at: 1.74, swing: 0.75 },
  { key: "swatch2", from: [3.2, 0.7, 1.5], spin: [1.1, -1.7, 0.6], at: 1.82, swing: 0.75 },
  { key: "swatch3", from: [3.4, -0.1, 1.7], spin: [-1.6, 1.1, -0.7], at: 1.9, swing: 0.75 },
];

/**
 * Hero showcase timing, in seconds.
 *
 * RECON_END is where the rebuild is finished — the last ASSEMBLY entry starts
 * at 1.9 and its rotation tail runs 2.1 — so 4.2 leaves a beat before the
 * walkthrough takes the parts over.
 */
/**
 * Ampoule internals. NOZZLE_TIP_Y is the neck mesh's local origin (0.33) plus
 * half its height (0.19 / 2) — the point liquid actually leaves the bottle, and
 * the anchor the stream is built from every frame.
 */
const NOZZLE_TIP_Y = 0.425;
const AMPOULE_FILL_H = 0.46;
const AMPOULE_FILL_NECK_END = 0.23;

const RECON_END = 4.2;
const SHOWCASE_DURATION = 9.5;
const SHOWCASE_HOLD = 1;
const LOOP_GAP = 4;

function Vial({ reg }) {
  return (
    <group>
      <group ref={(n) => reg("vialBody", n)}>
        <mesh>
          <cylinderGeometry args={[0.42, 0.42, 2, 64, 1, true]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.06}
            metalness={0}
            transmission={1}
            thickness={0.45}
            ior={1.5}
            attenuationColor={AQUA}
            attenuationDistance={1.6}
            envMapIntensity={1.2}
            transparent
          />
        </mesh>
      </group>

      <group ref={(n) => reg("vialBase", n)} position={[0, -1, 0]}>
        <mesh>
          <sphereGeometry
            args={[0.42, 48, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]}
          />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.06}
            transmission={1}
            thickness={0.5}
            ior={1.5}
            attenuationColor={AQUA}
            attenuationDistance={1.6}
            envMapIntensity={1.2}
            transparent
          />
        </mesh>
      </group>

      <group ref={(n) => reg("reagent", n)} position={[0, -0.45, 0]}>
        <mesh>
          <cylinderGeometry args={[0.38, 0.38, 1.05, 48]} />
          <meshPhysicalMaterial
            color={TEAL_BRIGHT}
            roughness={0.12}
            transmission={0.72}
            thickness={0.9}
            ior={1.333}
            attenuationColor={AQUA}
            attenuationDistance={0.7}
            envMapIntensity={1.1}
            transparent
          />
        </mesh>
      </group>

      <group ref={(n) => reg("meniscus", n)} position={[0, 0.07, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.38, 48]} />
          <meshPhysicalMaterial
            color={AQUA}
            roughness={0.08}
            metalness={0.1}
            envMapIntensity={1.3}
          />
        </mesh>
      </group>

      <group ref={(n) => reg("capTop", n)} position={[0, 1.08, 0]}>
        <mesh>
          <cylinderGeometry args={[0.46, 0.46, 0.3, 48]} />
          <meshStandardMaterial color={TEAL} roughness={0.34} metalness={0.15} />
        </mesh>
      </group>

      <group ref={(n) => reg("capRing", n)} position={[0, 1.06, 0]}>
        <mesh>
          <cylinderGeometry args={[0.475, 0.475, 0.16, 48]} />
          <meshStandardMaterial
            color={TEAL_BRIGHT}
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/*
        The pour. Both of these are authored at the pose they hold mid-pour and
        start hidden — Choreography is the only thing that reveals them, so the
        hero (which runs the reconstruction but not the walkthrough) never sees
        them, and they are deliberately absent from ASSEMBLY for the same reason.

        The vial mouth is the top rim of the body cylinder: y = +1, centred on
        the origin with an inner radius of 0.42. Every number below is placed
        against that, so the stream lands inside the mouth rather than near it.
      */}
      <group
        ref={(n) => reg("ampoule", n)}
        position={[0.35, 1.87, 0.08]}
        rotation={[0, 0, 2.4]}
        visible={false}
      >
        {/* Glass shell. DoubleSide so the far wall is actually drawn — a
            single-sided transmissive shell has nothing behind the liquid and
            reads as a flat cut-out rather than a bottle. */}
        <mesh>
          <cylinderGeometry args={[0.13, 0.16, 0.52, 32]} />
          <meshPhysicalMaterial
            color="#dbeeea"
            roughness={0.08}
            transmission={0.94}
            thickness={0.32}
            ior={1.46}
            attenuationColor={AQUA}
            attenuationDistance={0.9}
            side={DoubleSide}
            transparent
          />
        </mesh>

        {/* The reagent itself. Without this the ampoule was an empty shell with
            a stream coming out of it. Authored full and drained by Choreography
            as the pour runs; because the bottle is tipped neck-down, what is
            left pools at the neck end rather than staying centred. */}
        <group ref={(n) => reg("ampouleFill", n)}>
          <mesh>
            <cylinderGeometry args={[0.112, 0.138, AMPOULE_FILL_H, 32]} />
            <meshPhysicalMaterial
              color={TEAL_BRIGHT}
              roughness={0.05}
              transmission={0.8}
              thickness={0.42}
              ior={1.36}
              attenuationColor={AQUA}
              attenuationDistance={0.32}
              transparent
            />
          </mesh>
        </group>

        <mesh position={[0, 0.33, 0]}>
          <cylinderGeometry args={[0.052, 0.088, 0.19, 24]} />
          <meshStandardMaterial color={TEAL} roughness={0.42} metalness={0.1} />
        </mesh>
      </group>

      {/*
        Stream. Authored one unit long and scaled on Y, because its length is
        not a constant: it is whatever the distance happens to be between the
        nozzle tip and the liquid surface on that frame, and both ends move.
        Choreography places it; nothing here is positioned by hand.

        Tapered narrow-end-down — a falling stream accelerates and thins. The
        previous geometry widened downward, which reads as a pour running
        upward.
      */}
      <group ref={(n) => reg("pourStream", n)} visible={false}>
        <mesh>
          <cylinderGeometry args={[0.042, 0.026, 1, 24]} />
          <meshPhysicalMaterial
            color={TEAL_BRIGHT}
            roughness={0.05}
            transmission={0.84}
            thickness={0.3}
            ior={1.333}
            attenuationColor={AQUA}
            attenuationDistance={0.45}
            transparent
          />
        </mesh>
      </group>
    </group>
  );
}

function TestStrip({ reg }) {
  return (
    <group position={[-0.92, 0.15, 0.12]} rotation={[0, 0, 0.19]}>
      <group ref={(n) => reg("stripBody", n)}>
        <RoundedBox args={[0.2, 1.7, 0.014]} radius={0.006} smoothness={3}>
          <meshStandardMaterial color={PAPER} roughness={0.92} metalness={0} />
        </RoundedBox>
      </group>
      <group ref={(n) => reg("stripPadA", n)} position={[0, -0.6, 0.009]}>
        <mesh>
          <planeGeometry args={[0.2, 0.34]} />
          <meshStandardMaterial color={AQUA} roughness={0.85} />
        </mesh>
      </group>
      <group ref={(n) => reg("stripPadB", n)} position={[0, -0.24, 0.009]}>
        <mesh>
          <planeGeometry args={[0.2, 0.16]} />
          <meshStandardMaterial color={BLUE} roughness={0.85} />
        </mesh>
      </group>
    </group>
  );
}

function ColourChart({ reg }) {
  return (
    <group position={[1.55, -0.5, -0.15]} rotation={[0, -0.42, 0]}>
      <group ref={(n) => reg("chartCard", n)}>
        <RoundedBox args={[0.92, 1.45, 0.02]} radius={0.04} smoothness={4}>
          <meshStandardMaterial color={PAPER} roughness={0.88} metalness={0} />
        </RoundedBox>
      </group>
      {CHART_SWATCHES.map((colour, index) => (
        <group
          key={colour}
          ref={(n) => reg(`swatch${index}`, n)}
          position={[0, 0.44 - index * 0.29, 0.012]}
        >
          <mesh>
            <planeGeometry args={[0.62, 0.22]} />
            <meshStandardMaterial color={colour} roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Camera. Follows the scrubbed walkthrough waypoints, plus an `introOffset`
 * that the entry timeline decays to zero — so the reconstruction is watched
 * from further out and the camera settles in as the last pieces land.
 */
function CameraRig({ progress, still, introOffset }) {
  const { camera } = useThree();
  const targetPosition = useMemo(() => new Vector3(), []);
  const lookTarget = useMemo(() => new Vector3(), []);
  const smoothedLook = useMemo(() => new Vector3(...WAYPOINTS[0].target), []);
  const a = useMemo(() => new Vector3(), []);
  const b = useMemo(() => new Vector3(), []);

  useFrame((state, delta) => {
    const t = Math.min(1, Math.max(0, progress?.current?.value ?? 0));
    const span = WAYPOINTS.length - 1;
    const scaled = t * span;
    const index = Math.min(span - 1, Math.floor(scaled));
    const localT = scaled - index;

    const from = WAYPOINTS[index];
    const to = WAYPOINTS[index + 1];

    a.set(...from.position);
    b.set(...to.position);
    targetPosition.copy(a).lerp(b, localT);

    a.set(...from.target);
    b.set(...to.target);
    lookTarget.copy(a).lerp(b, localT);

    if (introOffset) {
      targetPosition.x += introOffset.x;
      targetPosition.y += introOffset.y;
      targetPosition.z += introOffset.z;
    }

    if (!still) {
      // Parallax, halved. At the old amplitude the pointer was moving the
      // camera further than some of the authored beats did, which fought the
      // choreography for attention.
      targetPosition.x += state.pointer.x * 0.11;
      targetPosition.y += state.pointer.y * 0.07;
    }

    /**
     * Smoothing constant, deliberately short.
     *
     * The intro's camera shots are already eased by GSAP. Smoothing that result
     * again with a long time constant double-eases it: the timeline finishes,
     * but the camera is still a visible distance behind its target and carries
     * on drifting for most of a second — so the frame the animation ends on and
     * the frame it finally rests on are not the same picture. The damper only
     * has to soften the seams between shots and the pointer parallax, so it is
     * tight enough to have effectively arrived when the timeline ends.
     */
    damp3(camera.position, targetPosition, 0.12, delta);
    damp3(smoothedLook, lookTarget, 0.12, delta);
    camera.lookAt(smoothedLook);
  });

  return null;
}

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/** Eased 0→1 over [a,b] of the walkthrough's step axis. */
function phase(stepPos, a, b) {
  const t = clamp01((stepPos - a) / (b - a));
  return t * t * (3 - 2 * t);
}

const mix = (a, b, t) => a + (b - a) * t;

/** Smoothstepped 0→1, for sub-phases carved out of a `phase` result. */
const ease = (v) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};

/** Scratch for the per-frame nozzle solve — never allocate inside useFrame. */
const nozzle = new Vector3();

const CLEAR_WATER = new Color("#e8f6f3");
const REAGENT_TEAL = new Color(TEAL_BRIGHT);
const PAD_BLANK = new Color("#eceade");
const PAD_SAFE = new Color("#9cf2e8");
const PAD_ALERT = new Color("#e2574c");

/**
 * Step choreography — the product actually performing the five steps.
 *
 * Moving a camera around a static object explains nothing, and neither does a
 * vessel that fills itself. Every beat here is staged against the vial's real
 * geometry: the mouth is the top rim of the body cylinder at y = +1, centred on
 * the origin with an inner radius of 0.42, and the liquid surface sits at
 * y = -0.975 + level * 1.05.
 *
 *   0 Collect      the sample sits in the vial, clear, capped
 *   1 Add reagent  the cap lifts away, an ampoule tips over the open mouth and
 *                  a stream runs into it — the level rises and the colour turns
 *                  from water to teal *because* something was poured in
 *   2 Dip          the strip tracks across to the vial's centre line, comes
 *                  upright, and descends through the open mouth into the liquid
 *   3 Wait         the indicator pads develop, blank -> safe -> alert
 *   4 Compare      the strip rises clear of the mouth before it travels, then
 *                  parks against the chart and the matching swatch answers
 *
 * The order matters physically: the cap is off before anything enters the vial,
 * and the strip never passes through geometry that is still in the way.
 */
function Choreography({ parts, progress, gate }) {
  useFrame(() => {
    // The reconstruction and this both write position/rotation on the caps, the
    // reagent, the meniscus and the swatches. Running them on the same frame
    // means whichever lands last wins, and the rebuild visibly loses. The gate
    // is closed for the whole rebuild and opens once the kit is assembled, so
    // the two never contend for a part.
    if (gate && !gate.active) return;
    const registry = parts.current;
    const t = clamp01(progress?.current?.value ?? 0);
    const stepPos = t * (WAYPOINTS.length - 1);

    const capLift = phase(stepPos, 0.35, 0.85);
    const pourIn = phase(stepPos, 0.72, 1.0);
    const pourFlow = phase(stepPos, 0.92, 1.42);
    const pourOut = phase(stepPos, 1.42, 1.7);
    const fill = phase(stepPos, 0.95, 1.5);
    // The dip is three separated moves, not one blended one. The strip rests
    // beside the vial with its tip at y = -0.70, which is 1.7 below the rim, so
    // anything that starts travelling sideways before it has cleared the rim
    // drives the strip straight through the glass wall. Rise, then cross, then
    // descend — and the windows do not overlap.
    const raise = phase(stepPos, 1.32, 1.92);
    const across = phase(stepPos, 1.88, 2.28);
    const down = phase(stepPos, 2.34, 2.85);
    const react = phase(stepPos, 2.6, 3.55);
    const lift = phase(stepPos, 3.6, 4.0);

    // --- 1. The cap comes off first ---------------------------------------
    // Nothing may enter the vial until this has cleared the mouth, so it runs
    // ahead of the pour and stays out of the way for the rest of the sequence.
    for (const key of ["capTop", "capRing"]) {
      const cap = registry[key];
      const capHome = cap?.userData.homeTransform;
      if (!cap || !capHome) continue;
      // Arc up and back over the shoulder rather than sliding sideways, so it
      // reads as lifted off a thread instead of dissolving.
      const arc = Math.sin(capLift * Math.PI) * 0.4;
      cap.position.x = mix(capHome.position.x, 0.85, capLift);
      cap.position.y = mix(capHome.position.y, 1.95, capLift) + arc;
      cap.position.z = mix(capHome.position.z, -0.7, capLift);
      cap.rotation.z = capHome.rotation.z - capLift * 1.05;
      cap.rotation.x = capHome.rotation.x + capLift * 0.32;
    }

    // --- 2. The ampoule tips over the open mouth --------------------------
    const ampoule = registry.ampoule;
    const ampouleHome = ampoule?.userData.homeTransform;
    if (ampoule && ampouleHome) {
      const present = pourIn * (1 - pourOut);
      ampoule.visible = present > 0.01;
      // Enters from above and to the right, tips to pour, then untips and lifts
      // away once the stream has stopped.
      ampoule.position.x = ampouleHome.position.x + (1 - pourIn) * 0.5 + pourOut * 0.45;
      ampoule.position.y = ampouleHome.position.y + (1 - pourIn) * 0.6 + pourOut * 0.75;
      ampoule.rotation.z = mix(1.35, ampouleHome.rotation.z, pourIn * (1 - pourOut));
    }

    // --- 3. The reagent inside it drains -----------------------------------
    // The bottle is tipped neck-down, so the remaining liquid pools at the neck
    // end: the column shortens from the base, it does not shrink about its
    // centre. Anchoring the neck end and scaling away from it is what sells it.
    const ampouleFill = registry.ampouleFill;
    if (ampouleFill) {
      const remaining = Math.max(0.08, 1 - pourFlow * 0.86);
      ampouleFill.scale.y = remaining;
      ampouleFill.position.y =
        AMPOULE_FILL_NECK_END - (remaining * AMPOULE_FILL_H) / 2;
    }

    // --- 4. The level rises because of the pour ---------------------------
    // Step 0 already holds the collected sample, so this starts part-full and
    // clear, and the reagent both raises it and colours it.
    const reagent = registry.reagent;
    const reagentHome = reagent?.userData.homeTransform?.position;
    const level = 0.42 + fill * 0.58;
    // Top of the liquid column, in world units — the meniscus, the strip's dip
    // depth and the stream's landing point are all measured off this.
    const surfaceY = -0.975 + level * 1.05;
    if (reagent && reagentHome) {
      reagent.scale.y = level;
      // The cylinder scales about its centre, so drop it by half the lost
      // height to keep the liquid sitting on the base instead of floating.
      reagent.position.y = reagentHome.y - (1 - level) * 0.525;
      const mesh = reagent.children[0];
      if (mesh?.material) {
        mesh.material.color
          .copy(CLEAR_WATER)
          .lerp(REAGENT_TEAL, clamp01(fill * 0.85 + react * 0.15));
      }
    }

    /**
     * The stream, solved from the nozzle rather than authored.
     *
     * It used to be a fixed cylinder parked near the bottle, which left a
     * visible gap between the lip and the liquid — and because the ampoule
     * moves and tips throughout the pour while the stream did not, that gap
     * changed every frame.
     *
     * The nozzle tip is a fixed point in the ampoule's own space, so rotating
     * it by the ampoule's current rotation and adding its position gives the
     * tip in the parent's space — which is the space the stream lives in too,
     * so no world-matrix round trip is needed. The stream then spans from that
     * point straight down to the liquid surface: liquid leaves the lip along
     * the neck's axis but is vertical almost immediately under gravity.
     */
    const stream = registry.pourStream;
    if (stream && ampoule) {
      nozzle
        .set(0, NOZZLE_TIP_Y, 0)
        .applyEuler(ampoule.rotation)
        .add(ampoule.position);

      // Leading edge falls from the lip to the surface; trailing edge detaches
      // from the lip when the pour stops, so the last of it falls away instead
      // of the whole column vanishing at once.
      const lead = clamp01(pourFlow * 5);
      const trail = clamp01((1 - pourFlow) * 5);
      const topEdge = mix(surfaceY, nozzle.y, trail);
      const bottomEdge = mix(nozzle.y, surfaceY, lead);
      const length = topEdge - bottomEdge;

      stream.visible = ampoule.visible && length > 0.01;
      if (stream.visible) {
        stream.position.set(nozzle.x, (topEdge + bottomEdge) / 2, nozzle.z);
        stream.scale.set(1, length, 1);
      }
    }

    // --- 5. Meniscus rides the surface, and takes the impact --------------
    const meniscus = registry.meniscus;
    if (meniscus) {
      meniscus.position.y = surfaceY;
      meniscus.visible = level > 0.03;
      // Widens slightly where the stream lands, then settles.
      const impact = Math.min(1, pourFlow * 5) * Math.min(1, (1 - pourFlow) * 5);
      meniscus.scale.setScalar(0.94 + level * 0.06 + impact * 0.05);
    }

    // --- 6. The strip goes in through the mouth, not through the glass ----
    const strip = registry.stripBody?.parent;
    if (strip) {
      if (!strip.userData.stripHome) {
        strip.userData.stripHome = {
          x: strip.position.x,
          y: strip.position.y,
          z: strip.position.z,
          rz: strip.rotation.z,
        };
      } else {
        const home = strip.userData.stripHome;

        // Body is 1.7 long, so the tip sits 0.85 below the group origin.
        // RIM_CLEAR_Y puts that tip at 1.13 — above the rim at 1.00 — which is
        // the height the strip has to reach before it may travel over the mouth
        // or back out again. DIP_Y then puts the tip 0.62 under the surface
        // with the top still clear of the mouth.
        const RIM_CLEAR_Y = 1.98;
        const DIP_Y = 0.3;

        // Rise (still beside the vial) -> cross to the centre line -> descend.
        let y = mix(home.y, RIM_CLEAR_Y, raise);
        y = mix(y, DIP_Y, down);
        let x = mix(home.x, 0, across);
        let z = mix(home.z, 0, across);
        let rz = home.rz * (1 - raise);
        let ry = 0;

        if (lift > 0) {
          // Same rule in reverse: fully out of the mouth before it goes
          // anywhere near the chart.
          const up = ease(lift / 0.45);
          const over = ease((lift - 0.5) / 0.5);
          y = mix(y, RIM_CLEAR_Y, up);
          x = mix(x, 1.3, over);
          y = mix(y, -0.3, over);
          z = mix(z, 0.2, over);
          ry = -0.42 * over;
          rz -= over * 0.1;
        }

        strip.position.set(x, y, z);
        strip.rotation.z = rz;
        strip.rotation.y = ry;
      }
    }

    // --- 7. Indicator pads develop ----------------------------------------
    const padA = registry.stripPadA?.children[0];
    const padB = registry.stripPadB?.children[0];
    if (padA?.material) {
      padA.material.color
        .copy(PAD_BLANK)
        .lerp(PAD_SAFE, clamp01(react * 2))
        .lerp(PAD_ALERT, clamp01((react - 0.5) * 2));
    }
    if (padB?.material) {
      padB.material.color.copy(PAD_BLANK).lerp(PAD_SAFE, react);
    }

    // --- 8. The matching swatch answers ------------------------------------
    // Index 3 is the alert patch the developed pad lands on.
    for (let i = 0; i < CHART_SWATCHES.length; i += 1) {
      const swatch = registry[`swatch${i}`];
      if (!swatch?.userData.homeTransform) continue;
      const isMatch = i === 3;
      const pop = isMatch ? lift : 0;
      swatch.scale.setScalar(1 + pop * 0.16);
      swatch.position.z =
        swatch.userData.homeTransform.position.z + pop * 0.06;
    }
  });

  return null;
}

const DESIGN_WIDTH = 4.6;

function ResponsiveRig({ children }) {
  const { viewport } = useThree();
  const scale = Math.min(1, viewport.width / DESIGN_WIDTH);
  return <group scale={scale}>{children}</group>;
}

function Scene({
  progress,
  still,
  reg,
  parts,
  assemble,
  introOffset,
  choreograph,
  loop,
  gate,
  showcase,
  timelineRef,
}) {
  const group = useRef(null);

  useFrame((state, delta) => {
    if (!group.current || still) return;
    const t = Math.min(1, Math.max(0, progress?.current?.value ?? 0));
    // Halved from the original sweep. With the camera now arcing on a fixed
    // lens, a large counter-rotation on the kit as well read as two moves
    // fighting rather than one considered one.
    dampE(group.current.rotation, [0, -0.28 + t * 0.5, 0], 0.6, delta);
  });

  /**
   * The reconstruction timeline.
   *
   * This has to live here, inside the suspended subtree, and not in the
   * component that owns the <Canvas>. `suspend(APARTMENT_HDRI)` below throws a
   * promise on first render, so none of these meshes exist until the HDRI has
   * loaded. An effect in the outer component fires long before that, finds an
   * empty part registry, and silently animates nothing — which is exactly the
   * "everything just appears" failure.
   *
   * As a parent of the parts, this component's layout effect is guaranteed to
   * run after React has attached every child ref. useLayoutEffect rather than
   * useEffect so the pieces are displaced before the first paint, otherwise the
   * assembled kit flashes for a frame.
   *
   * Each piece gets three overlapping tweens rather than one:
   *   - position, split per axis: horizontal on `swing`-scaled `expo.out`,
   *     vertical shorter on `back.out`. Mismatched per-axis durations are what
   *     bend the path into an arc; matched ones are a straight slide.
   *   - rotation, on a long `power4` tail, so pieces are still settling their
   *     spin after they arrive — the detail that reads as weight.
   *   - scale, seating late with `back.out`.
   */
  // Home transforms are cached for every registered part regardless of whether
  // this instance plays the reconstruction. The walkthrough canvas has
  // assemble=false but the step choreography still measures against them.
  useLayoutEffect(() => {
    const registry = parts.current;
    Object.values(registry).forEach((node) => {
      if (!node || node.userData.homeTransform) return;
      node.userData.homeTransform = {
        position: node.position.clone(),
        rotation: { x: node.rotation.x, y: node.rotation.y, z: node.rotation.z },
      };
    });
  }, [parts]);

  useLayoutEffect(() => {
    if (!assemble || still) return undefined;

    const registry = parts.current;
    const missing = ASSEMBLY.filter(({ key }) => !registry[key]).map((p) => p.key);
    if (missing.length) {
      // Loud on purpose: a silently empty registry is the bug this whole
      // comment block exists to prevent regressing.
      console.warn("[TestKitScene] parts missing from registry:", missing);
    }

    /**
     * Put the walkthrough's parts back to their step-0 pose.
     *
     * The rebuild's tweens cover everything in ASSEMBLY, but the walkthrough
     * also moves the test strip's *parent* group and toggles the ampoule and
     * the stream, none of which ASSEMBLY knows about. Without this the second
     * cycle would rebuild the strip inside a group still parked at the colour
     * chart.
     */
    const resetShowcase = () => {
      if (showcase) showcase.current.value = 0;
      if (gate) gate.active = false;
      const strip = registry.stripBody?.parent;
      const stripHome = strip?.userData.stripHome;
      if (strip && stripHome) {
        strip.position.set(stripHome.x, stripHome.y, stripHome.z);
        strip.rotation.set(0, 0, stripHome.rz);
      }
      if (registry.ampoule) registry.ampoule.visible = false;
      if (registry.pourStream) registry.pourStream.visible = false;
      // Refill it. Without this the second cycle pours from an empty bottle.
      const fill = registry.ampouleFill;
      if (fill) {
        fill.scale.y = 1;
        fill.position.y = AMPOULE_FILL_NECK_END - AMPOULE_FILL_H / 2;
      }
    };

    const timeline = gsap.timeline({
      delay: 0.15,
      repeat: loop ? -1 : 0,
      repeatDelay: loop ? LOOP_GAP : 0,
      onRepeat: resetShowcase,
    });
    if (timelineRef) timelineRef.current = timeline;
    if (loop) resetShowcase();

    /**
     * Camera for the build: one slow push in, and nothing else.
     *
     * This used to be four cut-together shots with their own eases. On a loop
     * that plays every few seconds, four moves per cycle is restless — and the
     * dolly range was doing the same thing the old waypoints did, changing the
     * subject's size for no narrative reason. A single 3.4s settle from
     * slightly wider reads as a crane easing onto its mark.
     */
    timeline.fromTo(
      introOffset,
      { x: 0.5, y: 0.42, z: 1.55 },
      { x: 0, y: 0, z: 0, duration: 3.4, ease: "power2.inOut" },
      0
    );

    ASSEMBLY.forEach(({ key, from, spin, at, swing }) => {
      const node = registry[key];
      if (!node) return;

      // The authored transform, cached on the node the first time we see it.
      //
      // This must never be re-read from the live position. React 19 runs
      // effects twice on mount in development: the first pass displaces the
      // piece, the cleanup kills the timeline while it is still displaced, and
      // a second pass that measured "home" from the current position would
      // treat the displaced point as home and offset again from there.
      if (!node.userData.homeTransform) {
        node.userData.homeTransform = {
          position: node.position.clone(),
          rotation: {
            x: node.rotation.x,
            y: node.rotation.y,
            z: node.rotation.z,
          },
        };
      }
      const { position: home, rotation: rest } = node.userData.homeTransform;

      /**
       * fromTo, not to — and this is what makes the loop possible at all.
       *
       * A `to` tween reads its start value once, when the timeline is built.
       * On the second cycle the piece is already home, so the tween would run
       * from home to home and nothing would rebuild. Declaring both ends means
       * every repeat re-displaces the piece first.
       *
       * Three overlapping tweens per piece rather than one: position split per
       * axis (horizontal on `swing`-scaled expo.out, vertical shorter on
       * back.out) is what bends the path into an arc; rotation on a long
       * power4 tail leaves pieces still settling their spin after they arrive.
       */
      timeline
        .fromTo(
          node.position,
          { x: home.x + from[0] },
          { x: home.x, duration: 1.5 * swing, ease: "expo.out" },
          at
        )
        .fromTo(
          node.position,
          { z: home.z + from[2] },
          { z: home.z, duration: 1.35 * swing, ease: "expo.out" },
          at + 0.05
        )
        .fromTo(
          node.position,
          { y: home.y + from[1] },
          { y: home.y, duration: 1.05, ease: "back.out(1.4)" },
          at + 0.18
        )
        .fromTo(
          node.rotation,
          { x: rest.x + spin[0], y: rest.y + spin[1], z: rest.z + spin[2] },
          { x: rest.x, y: rest.y, z: rest.z, duration: 2.1, ease: "power4.out" },
          at
        )
        .fromTo(
          node.scale,
          { x: 0.6, y: 0.6, z: 0.6 },
          { x: 1, y: 1, z: 1, duration: 0.9, ease: "back.out(2.2)" },
          at + 0.3
        );
    });

    /**
     * Hand-off: the assembled kit then performs the five steps.
     *
     * The gate opens only once the last piece has seated, so the rebuild owns
     * the parts up to RECON_END and the walkthrough owns them after it. `none`
     * easing on the sweep is deliberate — each beat inside Choreography is
     * already smoothstepped by `phase`, and easing the driver as well would
     * double-ease every one of them.
     */
    if (loop && showcase) {
      timeline.call(
        () => {
          if (gate) gate.active = true;
        },
        null,
        RECON_END
      );
      timeline.fromTo(
        showcase.current,
        { value: 0 },
        { value: 1, duration: SHOWCASE_DURATION, ease: "none" },
        RECON_END
      );
      // Dead air on the end of the timeline so the finished kit is allowed to
      // sit there before the cycle restarts.
      timeline.to({}, { duration: SHOWCASE_HOLD }, RECON_END + SHOWCASE_DURATION);
    }

    return () => {
      timeline.kill();
      if (timelineRef) timelineRef.current = null;

      // Killing a timeline mid-flight leaves every piece wherever it happened
      // to be, so put them back on their seats. Without this, an interrupted
      // run (StrictMode's double mount, or a fast unmount) strands the kit in
      // pieces with nothing left to animate it home.
      ASSEMBLY.forEach(({ key }) => {
        const node = registry[key];
        const home = node?.userData.homeTransform;
        if (!home) return;
        node.position.copy(home.position);
        node.rotation.set(home.rotation.x, home.rotation.y, home.rotation.z);
        node.scale.setScalar(1);
      });

      resetShowcase();
      if (gate) gate.active = !loop;

      introOffset.x = 0;
      introOffset.y = 0;
      introOffset.z = 0;
    };
  }, [assemble, still, parts, introOffset, loop, gate, showcase, timelineRef]);

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 4]} intensity={1.4} />
      <pointLight position={[-6, -1.5, -4]} intensity={10} color={BLUE} />
      <pointLight position={[4, -3, 3]} intensity={5} color={AQUA} />

      <ResponsiveRig>
        <group ref={group}>
          <Float
            speed={still ? 0 : 0.9}
            rotationIntensity={still ? 0 : 0.12}
            floatIntensity={still ? 0 : 0.45}
            floatingRange={[-0.05, 0.05]}
          >
            <Vial reg={reg} />
            <TestStrip reg={reg} />
            <ColourChart reg={reg} />
          </Float>
        </group>

        <ContactShadows
          position={[0, -1.62, 0]}
          opacity={0.32}
          scale={11}
          blur={3}
          far={4}
          resolution={512}
          color="#0d3b39"
        />
      </ResponsiveRig>

      {choreograph || loop ? (
        <Choreography parts={parts} progress={progress} gate={gate} />
      ) : null}

      <Environment files={suspend(APARTMENT_HDRI).default} />
      <Preload all />
    </>
  );
}

export default function TestKitScene({
  className = "",
  progress,
  assemble = false,
  choreograph = false,
  loop = false,
}) {
  /**
   * Reduced-motion preference, resolved after mount rather than during render.
   *
   * Reading matchMedia inside useMemo meant the server rendered `false` and the
   * client's first render returned the real value — a server/client branch, and
   * a hydration mismatch for anyone who asks for reduced motion, because Float's
   * props are derived from it. Starting at `false` keeps both first renders in
   * agreement; the effect then corrects it, and tracks later changes.
   */
  const [still, setStill] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setStill(query.matches);
    const onChange = (event) => setStill(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const parts = useRef({});
  const introOffset = useMemo(() => ({ x: 0, y: 0, z: 0 }), []);

  /**
   * The hero drives itself. `progress` is the scroll-scrubbed value the
   * walkthrough section supplies; in loop mode the master timeline owns an
   * equivalent value instead, and both the camera and the choreography read
   * whichever one is in charge — so the two modes share every part of the rig
   * apart from what advances the clock.
   */
  const showcase = useRef({ value: 0 });
  const gate = useMemo(() => ({ active: !loop }), [loop]);
  const timelineRef = useRef(null);
  const hostRef = useRef(null);
  const activeProgress = loop ? showcase : progress;

  const reg = useMemo(
    () => (key, node) => {
      if (node) parts.current[key] = node;
    },
    []
  );

  /**
   * A loop nobody is looking at is wasted battery, and on a laptop it is
   * audible. Pause the whole timeline when the canvas leaves the viewport.
   */
  useEffect(() => {
    const host = hostRef.current;
    if (!loop || !host || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const tl = timelineRef.current;
        if (!tl) return;
        if (entry.isIntersecting) tl.resume();
        else tl.pause();
      },
      { threshold: 0.05 }
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [loop]);


  return (
    <div ref={hostRef} className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: WAYPOINTS[0].position, fov: 38 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.transmissionResolutionScale = 0.5;
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene
            progress={activeProgress}
            still={still}
            reg={reg}
            parts={parts}
            assemble={assemble}
            introOffset={introOffset}
            choreograph={choreograph}
            loop={loop}
            gate={gate}
            showcase={showcase}
            timelineRef={timelineRef}
          />
          <CameraRig
            progress={activeProgress}
            still={still}
            introOffset={introOffset}
          />
        </Suspense>
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}
