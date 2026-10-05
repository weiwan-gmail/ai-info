"use client";

import dynamic from "next/dynamic";

export const HeroCanvas = dynamic(() => import("./labs/HeroScene").then((mod) => mod.HeroScene), {
  ssr: false,
});
