"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uChroma;
  uniform float uBlur;
  uniform float uArc;
  #define PI 3.14159265359

  float disc(vec2 uv, float softness) {
    float r = length(uv - 0.5);
    return 1.0 - smoothstep(0.48 - softness, 0.48 + softness, r);
  }

  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p);
    float theta = atan(p.y, p.x);

    float sweepAngle = mod(uTime, 2.0 * PI) - PI;

    float d = abs(theta - sweepAngle);
    d = min(d, 2.0 * PI - d);

    float band = smoothstep(uArc, 0.0, d);
    float edge = smoothstep(0.30, 0.48, r);
    float mask = edge * band;

    vec2 dir = r > 0.0001 ? p / r : vec2(1.0, 0.0);

    float chroma = uChroma * mask;
    float blurAmt = uBlur * mask;

    // softness scales with blur so each tap's transition zone overlaps its neighbours,
    // preventing discrete bands from showing through
    float softness = max(0.004, blurAmt * 0.5);

    vec3 col = vec3(0.0);
    const int TAPS = 5;
    float total = 0.0;
    for (int i = 0; i < TAPS; i++) {
      float t = (float(i) - 2.0) / 2.0;
      float wgt = exp(-t * t * 1.5);
      vec2 off = dir * t * blurAmt;
      float rCh = disc(vUv + off + dir * chroma, softness);
      float gCh = disc(vUv + off,                 softness);
      float bCh = disc(vUv + off - dir * chroma, softness);
      col += vec3(rCh, gCh, bCh) * wgt;
      total += wgt;
    }
    col /= total;

    float alpha = max(max(col.r, col.g), col.b);
    gl_FragColor = vec4(col, alpha);
  }
`;

const UNIFORMS = {
  uTime: { value: 0 },
  uChroma: { value: 0.04 },
  uBlur: { value: 0.05 },
  uArc: { value: 0.9 },
};

function Disc() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const size = Math.min(viewport.width, viewport.height);

  const uniforms = useRef(
    Object.fromEntries(
      Object.entries(UNIFORMS).map(([k, v]) => [k, { value: v.value }]),
    ),
  );

  useFrame((_, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh scale={[size, size, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms.current}
        transparent
      />
    </mesh>
  );
}

export default function ChromaticRimSweep() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      style={{ background: "#0a0a0f" }}
      dpr={[1, 2]}
    >
      <Disc />
    </Canvas>
  );
}
