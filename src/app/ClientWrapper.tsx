"use client";
import { Scene } from "@/components/scenes";
import { Theme } from "@radix-ui/themes";

import "@radix-ui/themes/styles.css";

export default function ClientWrapper() {
  return (
    <Theme hasBackground={false}>
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
        <Scene />
      </div>
    </Theme>
  );
}
