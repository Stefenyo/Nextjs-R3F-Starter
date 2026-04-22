"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Effects } from "./components/Effects";

export default function ChromaticTextScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{
        antialias: true,
        toneMappingExposure: 1.0,
      }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#0a0a0a"]} />

      {/* Minimal lighting — we're mostly showing emissive text, but
          a soft ambient keeps the material from going flat black on non-lit pixels. */}
      <ambientLight intensity={0.4} />

      <Suspense fallback={null}>
        <Text
          font="./cormorant-garamond-v21-latin-700italic.woff"
          color="#e8eef5"
          fontSize={0.85}
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
  );
}
