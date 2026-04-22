"use client";
import dynamic from "next/dynamic";

const DefaultScene = dynamic(() => import("@/examples/DefaultScene"), {
  ssr: false,
});

// const ChromaticTextScene = dynamic(
//   () => import("@/examples/ChromaticTextScene"),
//   {
//     ssr: false,
//   },
// );

export default function ClientWrapper() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <DefaultScene />
    </div>
  );
}
