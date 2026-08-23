"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  Center,
  ContactShadows,
  Environment,
  Float,
  Preload,
  useGLTF,
} from "@react-three/drei";
import { dampE } from "maath/easing";
import { suspend } from "suspend-react";
import { Color } from "three";

/**
 * Hero 3D object — "Glass Vase with Flowers".
 *
 * The model is an existing, professionally authored glTF asset, not procedural
 * geometry. Source: the Khronos Group's official glTF Sample Assets library,
 * `Models/GlassVaseFlowers` —
 * https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/GlassVaseFlowers
 * Credited to Eric Chadwick (glass vase) and Rico Cilliers (flowers), released
 * under Creative Commons Zero v1.0 Universal (public domain): commercial use is
 * permitted and no attribution is required.
 *
 * It was chosen because it is one of the reference assets for
 * KHR_materials_transmission and KHR_materials_volume, so the glass is real
 * refraction — light bends through the vessel wall and the water volume, with
 * fresnel falloff and thickness-driven attenuation. That is the material
 * response a distorted sphere cannot fake, and a vessel of clean water is
 * directly on-brand for a water-safety product.
 *
 * Everything around the model is unchanged from the previous implementation:
 * the studio HDRI, the three-point rig, ContactShadows, the responsive rig,
 * AdaptiveDpr, and the reduced-motion contract.
 */

const MODEL_URL = "/models/glass-vase-flowers.glb";

// Warms the cache as soon as this chunk is parsed. The chunk itself is behind a
// dynamic import in the hero, so neither the model nor three.js is in the
// initial bundle — this only runs once the hero has decided to render 3D.
useGLTF.preload(MODEL_URL);

/**
 * The environment does most of the lighting here, so the choice matters more
 * than usual.
 *
 * `studio` is wrong for glass: it is essentially a white softbox, and a
 * roughness-0 transmissive surface mirrors it from every angle, so the vase
 * renders as a solid white silhouette. Refractive materials need an
 * environment with structure to bend and reflect. `apartment` is a soft
 * interior — bright windows against darker walls — which gives the glass edges
 * and highlights to catch without putting anything legible in the reflection
 * the way a city skyline would.
 */
const APARTMENT_HDRI = import("@pmndrs/assets/hdri/apartment.exr");

/**
 * The asset ships as a side-by-side comparison: an alpha-blended vase on the
 * left and a transmission+volume vase on the right, each with its own flowers.
 * Only the transmission vase is physically correct — the alpha-blended twin
 * exists to demonstrate the inferior technique, and it suffers depth-sorting
 * artefacts. So the comparison half is dropped and the real one is kept.
 */
const COMPARISON_ONLY = new Set(["GlassAlpha", "Flowers1"]);

/**
 * Jaljyoti teal, applied as volume attenuation rather than base colour.
 *
 * The asset's glass is untinted, and untinted glass in front of a near-white
 * page refracts near-white — physically right, visually inert. Attenuation
 * colours light by how far it travels through the medium, so the vessel stays
 * clear at its thin edges and deepens to teal through the body and the water.
 * That is the "coloured transmission" case KHR_materials_volume exists for, and
 * it puts the brand colour into the glass without touching the geometry.
 */
const GLASS_TINT = new Color("#7ce0d2");

function GlassVase() {
  const { scene } = useGLTF(MODEL_URL);

  const model = useMemo(() => {
    const root = scene.clone(true);

    root.children
      .filter((child) => COMPARISON_ONLY.has(child.name))
      .forEach((child) => root.remove(child));

    root.traverse((object) => {
      if (!object.isMesh || !object.material) return;
      if (!(object.material.transmission > 0)) return;

      // Cloned so the tint never leaks into drei's cached copy of the asset,
      // which is shared across every consumer of this URL.
      const glass = object.material.clone();
      glass.attenuationColor = GLASS_TINT;
      // Attenuation is exponential per channel, so a dark tint drives the
      // asset's thick solid foot to black. A bright tint with a short distance
      // gives the opposite balance: nearly clear across the thin bowl wall,
      // saturated aqua wherever the glass is thick, and never muddy.
      glass.attenuationDistance = 0.85;
      glass.thickness = 0.85;
      glass.envMapIntensity = 1.2;
      object.material = glass;
    });

    return root;
  }, [scene]);

  return <primitive object={model} />;
}

/**
 * Scales the composition to fit the canvas.
 *
 * The hero canvas is tall and narrow on a phone, and a perspective camera's
 * horizontal field of view shrinks with the aspect ratio — so at a fixed scale
 * the model overflows and gets sliced against the canvas edge. `viewport`
 * reports the visible area in world units at z=0, so dividing by the width the
 * layout was designed at keeps everything in frame at any aspect.
 */
const DESIGN_WIDTH = 3.4;

function ResponsiveRig({ children }) {
  const { viewport } = useThree();
  const scale = Math.min(1, viewport.width / DESIGN_WIDTH);
  return <group scale={scale}>{children}</group>;
}

/**
 * Cursor parallax and scroll-linked drift.
 *
 * Both are deliberately small — a few degrees. The headline is the primary
 * message; the vase supports it and must never pull the eye off the type.
 * `dampE` is maath's frame-rate-independent exponential smoothing (the same
 * helper the drei examples use), so the object eases toward its target instead
 * of snapping to the pointer.
 *
 * Scroll is read straight from `window.scrollY` rather than through another
 * ScrollTrigger: this runs inside the r3f frame loop, which GSAP's ticker
 * already drives via Lenis, so the value is read on the same clock as the rest
 * of the page's scroll choreography without registering a second trigger.
 */
function PointerRig({ still, children }) {
  const group = useRef(null);

  useFrame((state, delta) => {
    if (!group.current) return;

    if (still) {
      dampE(group.current.rotation, [0, 0, 0], 0.4, delta);
      return;
    }

    const progress =
      window.innerHeight > 0
        ? Math.min(1, window.scrollY / window.innerHeight)
        : 0;

    dampE(
      group.current.rotation,
      [
        state.pointer.y * 0.09 + progress * 0.12,
        state.pointer.x * 0.2 + progress * 0.45,
        0,
      ],
      0.5,
      delta
    );
  });

  return <group ref={group}>{children}</group>;
}

/** Fills the model's bounding box to roughly this height, in world units. */
const MODEL_SCALE = 15.5;

function Scene({ still }) {
  return (
    <>
      {/* Cinematic three-point rig: cool key from upper right, brand-blue rim
          from behind left, warm-teal fill low right. No shadow map — the
          transmission pass already re-renders the scene each frame, and
          ContactShadows grounds the object far more cheaply. */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[4, 6, 4]} intensity={1.1} />
      {/* Brand-coloured rim and fill only. These were tuned when the object
          was a small sphere; against a model 13.5x larger they blew the glass
          out completely, so they are now accents on top of the HDRI rather
          than the primary light sources. */}
      <pointLight position={[-6, -1.5, -4]} intensity={8} color="#5bb8fe" />
      <pointLight position={[4, -3, 3]} intensity={4} color="#80d5cb" />

      <ResponsiveRig>
        <PointerRig still={still}>
          <Float
            speed={still ? 0 : 1.1}
            rotationIntensity={still ? 0 : 0.25}
            floatIntensity={still ? 0 : 0.8}
            floatingRange={[-0.08, 0.08]}
          >
            {/* The asset is authored at roughly 0.2 world units tall and its
                origin sits at the vase's foot, so it needs both centering and
                a large uniform scale before it fills the frame. */}
            <group scale={MODEL_SCALE}>
              <Center>
                <GlassVase />
              </Center>
            </group>
          </Float>
        </PointerRig>

        {/* Dropped clear of the vase's foot. Sat any closer, the solid glass
            base refracts the shadow plane directly beneath it and reads as an
            opaque black lump rather than glass. */}
        <ContactShadows
          position={[0, -1.75, 0]}
          opacity={0.3}
          scale={12}
          blur={3.2}
          far={4}
          resolution={512}
          color="#0d3b39"
        />
      </ResponsiveRig>

      <Environment files={suspend(APARTMENT_HDRI).default} />
      <Preload all />
    </>
  );
}

export default function HeroScene({ className = "" }) {
  // Honour the same reduced-motion contract the rest of the site uses: the
  // vase still renders and stays lit, it simply stops moving.
  const still = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return (
    <div className={className} aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6], fov: 35 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          // Transmission renders the whole scene into an offscreen buffer every
          // frame. Halving that buffer is the single biggest win available here
          // and is imperceptible on a soft-focus refraction like this one.
          gl.transmissionResolutionScale = 0.5;
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <Scene still={still} />
        </Suspense>
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
}
