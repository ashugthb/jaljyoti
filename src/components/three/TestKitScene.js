"use client";

import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
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
import { Color, Vector3 } from "three";

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

const WAYPOINTS = [
  { position: [0, 0.35, 6.2], target: [0, 0, 0] },
  { position: [1.5, 1.5, 3.4], target: [0, 0.85, 0] },
  { position: [-1.5, 0.55, 2.9], target: [-0.15, 0.15, 0] },
  { position: [0.5, -0.35, 2.4], target: [0, -0.45, 0] },
  { position: [2.4, 0.25, 3.4], target: [1.55, -0.15, 0] },
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
      targetPosition.x += state.pointer.x * 0.22;
      targetPosition.y += state.pointer.y * 0.14;
    }

    damp3(camera.position, targetPosition, 0.28, delta);
    damp3(smoothedLook, lookTarget, 0.28, delta);
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

const CLEAR_WATER = new Color("#e8f6f3");
const REAGENT_TEAL = new Color(TEAL_BRIGHT);
const PAD_BLANK = new Color("#eceade");
const PAD_SAFE = new Color("#9cf2e8");
const PAD_ALERT = new Color("#e2574c");

/**
 * Step choreography — the product actually performing the five steps.
 *
 * Moving the camera around a static object explains nothing: "Dip" has to dip,
 * "Wait" has to visibly react, "Compare" has to sit the strip against the
 * chart. This reads the same scrubbed `progress` the camera uses and drives the
 * model's state from it, so the geometry and the copy always agree.
 *
 *   0 Collect      empty vessel, clear sample
 *   1 Add reagent  liquid fills from the base, colour turns from water to teal
 *   2 Dip          the strip travels from beside the vial down into the liquid
 *   3 Wait         the indicator pads develop, blank → safe → alert
 *   4 Compare      the strip lifts out and parks against the chart, and the
 *                  swatch it matches scales up
 *
 * Everything is written relative to the transform cached by the reconstruction
 * effect, so the two never fight over what "home" means.
 */
function Choreography({ parts, progress }) {
  useFrame(() => {
    const registry = parts.current;
    const t = clamp01(progress?.current?.value ?? 0);
    const stepPos = t * (WAYPOINTS.length - 1);

    const fill = phase(stepPos, 0.15, 1.0);
    const dip = phase(stepPos, 1.2, 2.0);
    const react = phase(stepPos, 2.05, 3.0);
    const lift = phase(stepPos, 3.1, 4.0);

    // --- 1. Reagent fills the vial from the base upward --------------------
    const reagent = registry.reagent;
    const reagentHome = reagent?.userData.homeTransform?.position;
    if (reagent && reagentHome) {
      const level = 0.04 + fill * 0.96;
      reagent.scale.y = level;
      // Cylinder scales about its centre, so drop it by half the lost height
      // to keep the liquid sitting on the base instead of floating.
      reagent.position.y = reagentHome.y - (1 - level) * 0.525;
      const mesh = reagent.children[0];
      if (mesh?.material) {
        mesh.material.color.copy(CLEAR_WATER).lerp(REAGENT_TEAL, fill * 0.85 + react * 0.15);
        mesh.material.opacity = 1;
      }
    }

    // --- 2. Meniscus rides the surface ------------------------------------
    const meniscus = registry.meniscus;
    const meniscusHome = meniscus?.userData.homeTransform?.position;
    if (meniscus && meniscusHome) {
      meniscus.position.y = meniscusHome.y - (1 - fill) * 1.0;
      meniscus.visible = fill > 0.03;
      meniscus.scale.setScalar(0.9 + fill * 0.1);
    }

    // --- 3. Strip dips in, then lifts out and parks by the chart ----------
    const strip = registry.stripBody?.parent;
    const stripHome = strip?.userData.stripHome;
    if (strip) {
      if (!stripHome) {
        strip.userData.stripHome = {
          x: strip.position.x,
          y: strip.position.y,
          z: strip.position.z,
          rz: strip.rotation.z,
        };
      } else {
        // beside the vial → down into the liquid → up and across to the chart
        const inX = stripHome.x + 0.62;
        const inY = stripHome.y - 0.62;
        const byChartX = stripHome.x + 1.86;
        const byChartY = stripHome.y + 0.12;

        const x = stripHome.x + (inX - stripHome.x) * dip + (byChartX - inX) * lift;
        const y = stripHome.y + (inY - stripHome.y) * dip + (byChartY - inY) * lift;

        strip.position.x = x;
        strip.position.y = y;
        strip.position.z = stripHome.z + lift * 0.32;
        strip.rotation.z = stripHome.rz * (1 - dip * 0.85) - lift * 0.12;
      }
    }

    // --- 4. Indicator pads develop ----------------------------------------
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

    // --- 5. The matching swatch answers ------------------------------------
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

function Scene({ progress, still, reg, parts, assemble, introOffset, choreograph }) {
  const group = useRef(null);

  useFrame((state, delta) => {
    if (!group.current || still) return;
    const t = Math.min(1, Math.max(0, progress?.current?.value ?? 0));
    dampE(group.current.rotation, [0, -0.5 + t * 0.9, 0], 0.5, delta);
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

    const timeline = gsap.timeline({ delay: 0.15 });

    /**
     * Camera choreography for the build.
     *
     * A single decaying offset was the problem: the camera sat in one place and
     * merely drifted, so the reconstruction read as parts moving in front of a
     * static lens. This is a shot sequence instead — four moves, each with its
     * own ease, cut to what is arriving on screen.
     *
     * Offsets are relative to the hero waypoint, and negative z is closer, so
     * the sequence opens tight and low and finishes at the framing the hero
     * actually needs. Mutated in place: CameraRig holds a reference to this
     * exact object, so reassigning it would leave the camera reading a stale
     * one.
     */
    introOffset.x = -2.1;
    introOffset.y = -1.6;
    introOffset.z = -3.2;

    timeline
      // 1. Low macro, sweeping right as the vessel builds itself.
      .to(
        introOffset,
        { x: 1.9, y: 0.2, z: -2.4, duration: 1.5, ease: "sine.inOut" },
        0
      )
      // 2. Rise over the mouth as the reagent pours and the cap seats.
      .to(
        introOffset,
        { x: 0.8, y: 1.7, z: -1.1, duration: 1.15, ease: "sine.inOut" },
        1.5
      )
      // 3. Fall back and left as the strip arrives.
      .to(
        introOffset,
        { x: -0.7, y: 0.5, z: 0.9, duration: 1.0, ease: "sine.inOut" },
        2.65
      )
      // 4. Settle onto the hero framing as the chart swatches land.
      .to(
        introOffset,
        { x: 0, y: 0, z: 0, duration: 1.3, ease: "power3.out" },
        3.65
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
      // treat the displaced point as home and offset again from there. The
      // piece then animates to the wrong place and the kit never assembles.
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

      node.position.set(home.x + from[0], home.y + from[1], home.z + from[2]);
      node.rotation.set(rest.x + spin[0], rest.y + spin[1], rest.z + spin[2]);
      node.scale.setScalar(0.6);

      timeline
        .to(node.position, { x: home.x, duration: 1.5 * swing, ease: "expo.out" }, at)
        .to(node.position, { z: home.z, duration: 1.35 * swing, ease: "expo.out" }, at + 0.05)
        .to(node.position, { y: home.y, duration: 1.05, ease: "back.out(1.4)" }, at + 0.18)
        .to(
          node.rotation,
          { x: rest.x, y: rest.y, z: rest.z, duration: 2.1, ease: "power4.out" },
          at
        )
        .to(node.scale, { x: 1, y: 1, z: 1, duration: 0.9, ease: "back.out(2.2)" }, at + 0.3);
    });

    return () => {
      timeline.kill();

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

      introOffset.x = 0;
      introOffset.y = 0;
      introOffset.z = 0;
    };
  }, [assemble, still, parts, introOffset]);

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

      {choreograph ? <Choreography parts={parts} progress={progress} /> : null}

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
}) {
  const still = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const parts = useRef({});
  const introOffset = useMemo(() => ({ x: 0, y: 0, z: 0 }), []);
  const reg = useMemo(
    () => (key, node) => {
      if (node) parts.current[key] = node;
    },
    []
  );


  return (
    <div className={className} aria-hidden="true">
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
            progress={progress}
            still={still}
            reg={reg}
            parts={parts}
            assemble={assemble}
            introOffset={introOffset}
            choreograph={choreograph}
          />
          <CameraRig
            progress={progress}
            still={still}
            introOffset={introOffset}
          />
        </Suspense>
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}
