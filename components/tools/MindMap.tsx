"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PairLink, ToolChapter, ToolGroup } from "@/lib/types";

type MapNode = {
  id: string;
  title: string;
  x: number;
  y: number;
  kind: "root" | "group" | "chapter";
  slug?: string;
};

const COL = 280;
const ROW = 48;

function layout(groups: ToolGroup[], chapters: ToolChapter[], collapsed: Set<string>) {
  const nodes: MapNode[] = [];
  const edges: { from: string; to: string }[] = [];
  let y = 0;
  const placedGroups: MapNode[] = [];
  for (const group of groups) {
    const children = chapters.filter((chapter) => chapter.group === group.id);
    if (collapsed.has(group.id) || children.length === 0) {
      const node: MapNode = { id: group.id, title: group.title, x: COL, y, kind: "group" };
      placedGroups.push(node);
      nodes.push(node);
      y += ROW + 18;
      continue;
    }
    const start = y;
    children.forEach((chapter, index) => {
      nodes.push({
        id: chapter.slug,
        title: chapter.title,
        slug: chapter.slug,
        x: COL * 2,
        y: start + index * ROW,
        kind: "chapter",
      });
      edges.push({ from: group.id, to: chapter.slug });
    });
    const mid = start + ((children.length - 1) * ROW) / 2;
    const groupNode: MapNode = { id: group.id, title: group.title, x: COL, y: mid, kind: "group" };
    placedGroups.push(groupNode);
    nodes.push(groupNode);
    y = start + children.length * ROW + 22;
  }
  const rootY = placedGroups.reduce((sum, node) => sum + node.y, 0) / Math.max(1, placedGroups.length);
  nodes.unshift({ id: "root", title: "工具", x: 16, y: rootY, kind: "root" });
  placedGroups.forEach((group) => edges.push({ from: "root", to: group.id }));
  const height = Math.max(y, 320);
  return { nodes, edges, height, width: COL * 2 + 240 };
}

export function MindMap({
  groups,
  chapters,
  pairs,
  focus,
  mode,
  highlightGroups,
}: {
  groups: ToolGroup[];
  chapters: ToolChapter[];
  pairs: PairLink[];
  focus?: string;
  mode?: string;
  highlightGroups: string[];
}) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [view, setView] = useState({ x: 24, y: 24, k: 0.92 });
  const host = useRef<HTMLDivElement>(null);
  const drag = useRef<{ px: number; py: number; x: number; y: number } | null>(null);
  const tree = useMemo(() => layout(groups, chapters, collapsed), [groups, chapters, collapsed]);
  const pairLayout = useMemo(() => buildPairs(chapters, pairs), [chapters, pairs]);
  const pairing = mode === "pairs";
  const scene = pairing ? pairLayout : tree;

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY > 0 ? 0.92 : 1.08;
      setView((current) => ({ ...current, k: Math.min(1.7, Math.max(0.45, current.k * delta)) }));
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    if (!focus) return;
    const target = scene.nodes.find((node) => node.id === focus || node.slug === focus);
    const box = host.current?.getBoundingClientRect();
    if (!target || !box) return;
    setView((current) => ({
      ...current,
      x: box.width / 2 - target.x * current.k,
      y: box.height / 2 - target.y * current.k,
    }));
  }, [focus, pairing, scene.nodes]);

  function nodeFill(node: MapNode) {
    if (node.kind === "root") return "#1a1714";
    if (highlightGroups.length === 0) return node.kind === "group" ? "#9a4e24" : "#f7f3ea";
    const groupId = node.kind === "group" ? node.id : chapters.find((chapter) => chapter.slug === node.slug)?.group;
    return highlightGroups.includes(groupId ?? "") ? (node.kind === "group" ? "#9a4e24" : "#fffaf3") : "#efe8dc";
  }

  return (
    <div
      ref={host}
      className="relative h-[640px] cursor-grab overflow-hidden rounded-2xl border border-line bg-[#f7f1e6] active:cursor-grabbing"
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest("a, button")) return;
        drag.current = { px: event.clientX, py: event.clientY, x: view.x, y: view.y };
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        setView((current) => ({
          ...current,
          x: drag.current!.x + event.clientX - drag.current!.px,
          y: drag.current!.y + event.clientY - drag.current!.py,
        }));
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerLeave={() => {
        drag.current = null;
      }}
    >
      <svg width="100%" height="100%" role="img" aria-label="工具思维导图">
        <g transform={`translate(${view.x} ${view.y}) scale(${view.k})`}>
          {pairing
            ? pairLayout.edges.map((edge) => <PairEdge key={`${edge.from}-${edge.to}`} edge={edge} nodes={pairLayout.nodes} />)
            : tree.edges.map((edge) => <TreeEdge key={`${edge.from}-${edge.to}`} edge={edge} nodes={tree.nodes} />)}
          {!pairing
            ? pairs.map((pair) => <DashPair key={`${pair.agent}-${pair.provider}`} pair={pair} nodes={tree.nodes} />)
            : null}
          {scene.nodes.map((node) => (
            <MapNodeView
              key={node.id}
              node={node}
              fill={pairing ? "#f7f3ea" : nodeFill(node)}
              focused={focus === node.id || focus === node.slug}
              onToggle={
                node.kind === "group"
                  ? () =>
                      setCollapsed((current) => {
                        const next = new Set(current);
                        if (next.has(node.id)) next.delete(node.id);
                        else next.add(node.id);
                        return next;
                      })
                  : undefined
              }
            />
          ))}
        </g>
      </svg>
      <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[11px] text-ink/45">拖动平移 · 滚轮缩放</p>
    </div>
  );
}

function endpoint(node: MapNode, side: "left" | "right") {
  const width = node.kind === "chapter" ? 196 : node.kind === "group" ? 148 : 72;
  return { x: node.x + (side === "right" ? width : 0), y: node.y + 16 };
}

function TreeEdge({ edge, nodes }: { edge: { from: string; to: string }; nodes: MapNode[] }) {
  const from = nodes.find((node) => node.id === edge.from);
  const to = nodes.find((node) => node.id === edge.to);
  if (!from || !to) return null;
  const a = endpoint(from, "right");
  const b = { x: to.x, y: to.y + 16 };
  const mid = (a.x + b.x) / 2;
  const d = `M ${a.x} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${b.x} ${b.y}`;
  const href = to.slug ? `/tools/${to.slug}` : `/tools?focus=${to.id}`;
  return (
    <a href={href}>
      <path d={d} stroke="transparent" strokeWidth="12" fill="none" />
      <path d={d} stroke="#c4b39a" strokeWidth="1.4" fill="none" />
    </a>
  );
}

function DashPair({ pair, nodes }: { pair: PairLink; nodes: MapNode[] }) {
  const providerSlug = pair.provider === "ollama" ? "local-models" : pair.provider;
  const from = nodes.find((node) => node.slug === providerSlug || node.id === pair.provider);
  const to = nodes.find((node) => node.slug === pair.agent);
  if (!from || !to) return null;
  const a = { x: from.x + 196, y: from.y + 16 };
  const b = { x: to.x, y: to.y + 16 };
  const d = `M ${a.x} ${a.y} C ${a.x + 40} ${a.y}, ${b.x - 40} ${b.y}, ${b.x} ${b.y}`;
  return (
    <a href={`/tools/pairing#${pair.anchor}`}>
      <path d={d} stroke="transparent" strokeWidth="10" fill="none" />
      <path d={d} stroke="#9a4e24" strokeWidth="1.2" strokeDasharray="4 4" fill="none" />
    </a>
  );
}

function PairEdge({
  edge,
  nodes,
}: {
  edge: { from: string; to: string; anchor: string };
  nodes: MapNode[];
}) {
  const from = nodes.find((node) => node.id === edge.from);
  const to = nodes.find((node) => node.id === edge.to);
  if (!from || !to) return null;
  const a = { x: from.x + 196, y: from.y + 16 };
  const b = { x: to.x, y: to.y + 16 };
  const d = `M ${a.x} ${a.y} C ${(a.x + b.x) / 2} ${a.y}, ${(a.x + b.x) / 2} ${b.y}, ${b.x} ${b.y}`;
  return (
    <a href={`/tools/pairing#${edge.anchor}`}>
      <path d={d} stroke="transparent" strokeWidth="12" fill="none" />
      <path d={d} stroke="#9a4e24" strokeWidth="1.4" strokeDasharray="5 4" fill="none" />
    </a>
  );
}

function MapNodeView({
  node,
  fill,
  focused,
  onToggle,
}: {
  node: MapNode;
  fill: string;
  focused: boolean;
  onToggle?: () => void;
}) {
  const width = node.kind === "chapter" ? 196 : node.kind === "group" ? 148 : 72;
  const ink = node.kind === "root" || (node.kind === "group" && fill === "#9a4e24") ? "#f3efe4" : "#1a1714";
  const label = (
    <text x={node.x + 12} y={node.y + 21} fontSize="13" fill={ink}>
      {node.title}
    </text>
  );
  const shape = <rect x={node.x} y={node.y} width={width} height="32" rx="8" fill={fill} stroke={focused ? "#9a4e24" : "#d9cbb6"} strokeWidth={focused ? 2 : 1} />;
  if (node.slug) {
    return (
      <a href={`/tools/${node.slug}`}>
        {shape}
        {label}
      </a>
    );
  }
  if (onToggle) {
    return (
      <a href={`/tools?focus=${node.id}`}>
        {shape}
        {label}
      </a>
    );
  }
  return (
    <a href="/tools">
      {shape}
      {label}
    </a>
  );
}

function buildPairs(chapters: ToolChapter[], pairs: PairLink[]) {
  const providerIds = [...new Set(pairs.map((pair) => pair.provider))];
  const agentIds = [...new Set(pairs.map((pair) => pair.agent))];
  const titleFor = (id: string) => {
    if (id === "ollama") return "本机模型";
    return chapters.find((chapter) => chapter.slug === id)?.title ?? id;
  };
  const nodes: MapNode[] = [
    ...providerIds.map((id, index) => ({
      id,
      title: titleFor(id),
      slug: id === "ollama" ? "local-models" : id,
      x: 20,
      y: 24 + index * 64,
      kind: "chapter" as const,
    })),
    ...agentIds.map((id, index) => ({
      id,
      title: titleFor(id),
      slug: id,
      x: 360,
      y: 24 + index * 58,
      kind: "chapter" as const,
    })),
  ];
  const edges = pairs.map((pair) => ({ from: pair.provider, to: pair.agent, anchor: pair.anchor }));
  return { nodes, edges, height: 520, width: 560 };
}
