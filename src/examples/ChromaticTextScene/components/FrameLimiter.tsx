"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

const FrameLimiter = ({ fps }: { fps: number }) => {
  const { invalidate } = useThree();

  useEffect(() => {
    const id = setInterval(() => invalidate(), 1000 / fps);
    return () => clearInterval(id);
  }, [fps, invalidate]);

  return null;
};

export { FrameLimiter };
