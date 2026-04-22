"use client";

import { useFrame } from "@react-three/fiber";

import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, ChromaticAberrationEffect } from "postprocessing";
import { Vector2 } from "three";
import { useRef, useMemo } from "react";

/**
 * Post-processing stack. Order is load-bearing:
 *   ChromaticAberration -> Bloom -> Noise -> Vignette
 */
const Effects = () => {
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
};

export { Effects };
