"use client";
import dynamic from "next/dynamic";

// R3F scenes reference `window` and WebGL at import time, both of which are unavailable during
// Next.js SSR. `ssr: false` defers the import entirely to the browser, preventing server crashes.
export default dynamic(() => import("./DefaultScene"), { ssr: false });
