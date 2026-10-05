"use client";

import { useMemo } from "react";
import type { PairLink, ToolChapter, ToolGroup } from "@/lib/types";

type MapNode = {
  id: string;
  title: string;
  x: number;
  y: number;
  kind: "root" | "group" | "chapter";
  slug?: string;
};

const NODE_W = 150;
const NODE_H = 22;
const PITCH = 26;
const COL_W = 162;
const PER_ROW = 4;

function layout(groups: ToolGroup[], chapters: ToolChapter[]) {
  const nodes: MapNode[] = [];
  const edges: { from: string; to: string }[] = [];
  const rowCount = Math.ceil(groups.length / PER_ROW);
  const rowHeights = Array.from({ length: rowCount }, (_, row) => {
    const slice = groups.slice(row * PER_ROW, row * PER_ROW + PER_ROW);
    const tallest = Math.max(1, ...slice.map((group) => chapters.filter((chapter) => chapter.group === group.id).length));
    return 28 + tallest * PITCH;
  });
  groups.forEach((group, index) => {
    const col = index % PER_ROW;
    const row = Math.floor(index / PER_ROW);
    const x = 8 + col * COL_W;
    const y = 8 + rowHeights.slice(0, row).reduce((sum, height) => sum + height, 0);
    nodes.push({ id: group.id, title: group.title, x, y, kind: "group" });
    chapters
      .filter((chapter) => chapter.group === group.id)
      .forEach((chapter, childIndex) => {
        nodes.push({
          id: chapter.slug,
          title: chapter.title,
          slug: chapter.slug,
          x,
          y: y + 28 + childIndex * PITCH,
          kind: "chapter",
        });
        edges.push({ from: group.id, to: chapter.slug });
      });
  });
  const width = 16 + PER_ROW * COL_W;
  const height = 16 + rowHeights.reduce((sum, height) => sum + height, 0);
  return { nodes, edges, height, width };
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
  const tree = useMemo(() => layout(groups, chapters), [groups, chapters]);
  const pairLayout = useMemo(() => buildPairs(chapters, pairs), [chapters, pairs]);
  const pairing = mode === "pairs";
  const scene = pairing ? pairLayout : tree;

  function nodeFill(node: MapNode) {
    if (node.kind === "root") return "#1a1714";
    if (highlightGroups.length === 0) return node.kind === "group" ? "#9a4e24" : "#f7f3ea";
    const groupId = node.kind === "group" ? node.id : chapters.find((chapter) => chapter.slug === node.slug)?.group;
    return highlightGroups.includes(groupId ?? "") ? (node.kind === "group" ? "#9a4e24" : "#fffaf3") : "#efe8dc";
  }

  return (
    <div className="rounded-2xl border border-line bg-[#f7f1e6] p-3">
      <svg viewBox={`0 0 ${scene.width} ${scene.height}`} className="h-auto w-full" role="img" aria-label="工具思维导图">
        {pairing
          ? pairLayout.edges.map((edge) => <PairEdge key={`${edge.from}-${edge.to}`} edge={edge} nodes={pairLayout.nodes} />)
          : tree.edges.map((edge) => <TreeEdge key={`${edge.from}-${edge.to}`} edge={edge} nodes={tree.nodes} />)}
        {!pairing ? pairs.map((pair) => <DashPair key={`${pair.agent}-${pair.provider}`} pair={pair} nodes={tree.nodes} />) : null}
        {scene.nodes.map((node) => (
          <MapNodeView key={node.id} node={node} fill={pairing ? "#f7f3ea" : nodeFill(node)} focused={focus === node.id || focus === node.slug} />
        ))}
      </svg>
    </div>
  );
}

function TreeEdge({ edge, nodes }: { edge: { from: string; to: string }; nodes: MapNode[] }) {
  const from = nodes.find((node) => node.id === edge.from);
  const to = nodes.find((node) => node.id === edge.to);
  if (!from || !to) return null;
  const x = from.x + NODE_W / 2;
  const d = `M ${x} ${from.y + NODE_H} L ${x} ${to.y}`;
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
  const a = { x: from.x + NODE_W, y: from.y + 11 };
  const b = { x: to.x, y: to.y + 11 };
  const d = `M ${a.x} ${a.y} C ${a.x + 24} ${a.y}, ${b.x - 24} ${b.y}, ${b.x} ${b.y}`;
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
  const a = { x: from.x + NODE_W, y: from.y + 11 };
  const b = { x: to.x, y: to.y + 11 };
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
}: {
  node: MapNode;
  fill: string;
  focused: boolean;
}) {
  const width = node.kind === "root" ? 64 : NODE_W;
  const ink = node.kind === "root" || (node.kind === "group" && fill === "#9a4e24") ? "#f3efe4" : "#1a1714";
  const label = (
    <text x={node.x + 8} y={node.y + 15} fontSize="11" fill={ink}>
      {node.title}
    </text>
  );
  const shape = <rect x={node.x} y={node.y} width={width} height={NODE_H} rx="6" fill={fill} stroke={focused ? "#9a4e24" : "#d9cbb6"} strokeWidth={focused ? 2 : 1} />;
  if (node.slug) {
    return (
      <a href={`/tools/${node.slug}`}>
        {shape}
        {label}
      </a>
    );
  }
  if (node.kind === "group") {
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
      y: 8 + index * 28,
      kind: "chapter" as const,
    })),
    ...agentIds.map((id, index) => ({
      id,
      title: titleFor(id),
      slug: id,
      x: 220,
      y: 8 + index * 28,
      kind: "chapter" as const,
    })),
  ];
  const edges = pairs.map((pair) => ({ from: pair.provider, to: pair.agent, anchor: pair.anchor }));
  const height = 20 + Math.max(providerIds.length, agentIds.length) * 28;
  return { nodes, edges, height, width: 420 };
}
