"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";

import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, ChromaticAberrationEffect } from "postprocessing";
import { Vector2 } from "three";
import { useRef, useMemo, Suspense } from "react";

/**
 * Post-processing stack. Order is load-bearing:
 *   ChromaticAberration -> Bloom -> Noise -> Vignette
 */
function Effects() {
  const caRef = useRef<ChromaticAberrationEffect>(null);

  // Stable Vector2 for the initial prop — prevents r3f from replacing
  // the uniform on every render.
  const initialOffset = useMemo(() => new Vector2(0.0022, 0.0022), []);

  // Gently modulate the chromatic aberration over time.
  // This is the secret sauce — static CA looks like a Photoshop filter,
  // animated CA reads as an unstable optical system.
  useFrame(({ clock }) => {
    const ca = caRef.current;
    if (!ca) return;

    const t = clock.getElapsedTime();
    const base = 0.0022;
    const wobble = Math.sin(t * 0.8) * 0.0006;

    // Mutate the existing uniform vector in place — never assign a new one.
    const offset = ca.uniforms.get("offset")?.value;
    if (offset) offset.set(base + wobble, base + wobble);
  });

  return (
    <EffectComposer multisampling={0}>
      {/* Radial-feeling RGB split. Keep offsets tiny — large values look cheap. */}
      <ChromaticAberration
        // ref={caRef}
        blendFunction={BlendFunction.NORMAL}
        offset={initialOffset}
        radialModulation={true}
        modulationOffset={0.15}
      />

      {/* The glow halo. Low threshold so even the slightly-emissive text blooms. */}
      <Bloom
        intensity={0.9}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        // mipmapBlur
        radius={0.8}
      />

      {/* Film grain. Additive, low opacity — it should sit ON the image, not replace it. */}
      <Noise premultiply blendFunction={BlendFunction.ADD} />

      {/* Darken the corners to pull the eye to the center. */}
      <Vignette eskil={false} offset={0.15} />
    </EffectComposer>
  );
}

export default function ChromaticTextScene() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#0a0a0a" }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{
          antialias: true,
          // Important for bloom — we want HDR-ish values to survive.
          toneMappingExposure: 1.0,
        }}
        // frameloop="demand"
        dpr={[1, 2]}
      >
        <color attach="background" args={["#0a0a0a"]} />

        {/* Minimal lighting — we're mostly showing emissive text, but
            a soft ambient keeps the material from going flat black on non-lit pixels. */}
        <ambientLight intensity={0.4} />

        {/* * The text itself — serif, slightly cool-white, with a touch of emissive
         * so the Bloom pass has something hot to latch onto. */}
        <Suspense fallback={null}>
          <Text
            font="./cormorant-garamond-v21-latin-700italic.woff"
            color="#e8eef5"
            fontSize={1}
            anchorX="center"
            anchorY="middle"
            maxWidth={1}
            lineHeight={0.75}
            fontStyle="italic"
            letterSpacing={-0.02}
          >
            Only Time
            <meshStandardMaterial
              color="#e8eef5"
              emissive="#ffffff"
              emissiveIntensity={0.35}
              toneMapped={false}
            />
          </Text>
        </Suspense>

        <Effects />
      </Canvas>
    </div>
  );
}
