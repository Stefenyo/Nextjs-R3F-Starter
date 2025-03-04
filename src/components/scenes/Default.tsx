"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { OrbitControls } from "@react-three/drei";

function Scene() {
  // Fixes issue related to window not being defined during SSR
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: "-1",
      }}
    >
      <Canvas
        style={{ width: "100%", height: "100%" }}
        eventPrefix="client"
        eventSource={window?.document?.body ?? undefined}
      >
        <ambientLight intensity={1} />

        {/* Single diamond in the center */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={"blue"} />
          <meshStandardMaterial
            color="white"
            emissive="white"
            emissiveIntensity={1}
            toneMapped={false}
          />
        </mesh>

        <OrbitControls />
        <EffectComposer>
          <Bloom
            intensity={0.5} // The bloom intensity.
            luminanceThreshold={0} // luminance threshold. Raise this value to mask out darker elements in the scene.
            luminanceSmoothing={0} // smoothness of the luminance threshold. Range is [0, 1]
            mipmapBlur={true} // Enables or disables mipmap blur.
          />
        </EffectComposer>
      </Canvas>
    </div>
  ) : null;
}

export default Scene;
