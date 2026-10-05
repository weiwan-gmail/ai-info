"use client";

import { useEffect, useId, useState } from "react";

export function MermaidView({ chart, caption }: { chart: string; caption?: string }) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancel = false;
    setError("");
    import("mermaid").then(async (mod) => {
      const mermaid = mod.default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "neutral",
        fontFamily: "Noto Sans SC, PingFang SC, sans-serif",
      });
      try {
        const drawn = await mermaid.render(`flow${rawId}`, chart);
        if (!cancel) setSvg(drawn.svg);
      } catch (caught) {
        if (!cancel) setError(caught instanceof Error ? caught.message : "图没有画出来");
      }
    });
    return () => {
      cancel = true;
    };
  }, [chart, rawId]);

  return (
    <figure className="my-8 overflow-x-auto rounded-2xl border border-line bg-sand px-3 py-4">
      {svg ? <div className="flex justify-center" dangerouslySetInnerHTML={{ __html: svg }} /> : <div className="h-40 animate-pulse rounded-xl bg-panel" />}
      {error ? <p className="mt-2 text-sm text-copper">{error}</p> : null}
      {caption ? <figcaption className="mt-3 text-center text-sm text-ink/60">{caption}</figcaption> : null}
    </figure>
  );
}
