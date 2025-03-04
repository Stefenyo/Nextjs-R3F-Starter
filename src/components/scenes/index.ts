import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/scenes/Default"), {
  ssr: false,
});

export { Scene };
