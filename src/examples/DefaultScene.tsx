"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { OrbitControls } from "@react-three/drei";

function Scene() {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      eventPrefix="client"
      eventSource={window?.document?.body}
      gl={{
        antialias: true,
        // Important for bloom — we want HDR-ish values to survive.
        toneMappingExposure: 1.0,
      }}
      frameloop="demand"
      dpr={[1, 2]}
    >
      <color attach="background" args={["#080707"]} />

      {/* Single diamond in the center */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="white"
          emissive="white"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      <EffectComposer>
        <Bloom
          intensity={0.5} // The bloom intensity.
          luminanceThreshold={0} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0} // smoothness of the luminance threshold. Range is [0, 1]
          // mipmapBlur={true} // Enables or disables mipmap blur.
        />
      </EffectComposer>
      <OrbitControls />
    </Canvas>
  );
}

export default Scene;
