"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Effects } from "./components/Effects";
import { FrameLimiter } from "./components/FrameLimiter";

export default function ChromaticTextScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{
        antialias: true,
        toneMappingExposure: 1.0,
      }}
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
      frameloop="demand"
    >
      <color attach="background" args={["#0a0a0a"]} />

      {/* Minimal lighting — we're mostly showing emissive text, but
          a soft ambient keeps the material from going flat black on non-lit pixels. */}
      <ambientLight intensity={0.5} />

      <Suspense fallback={null}>
        <Text
          font="./cormorant-garamond-v21-latin-700italic.woff"
          fontSize={0.85}
          anchorX="center"
          anchorY="middle"
          maxWidth={1}
          lineHeight={0.75}
          fontStyle="italic"
          letterSpacing={-0.02}
          textAlign="center"
        >
          Stay Present.
          <meshStandardMaterial
            color="#e8eef5"
            emissive="#ffffff"
            emissiveIntensity={0.35}
            toneMapped={false}
          />
        </Text>
      </Suspense>

      <FrameLimiter fps={30} />
      <Effects />
    </Canvas>
  );
}
