"use client";

import dynamic from "next/dynamic";
import {
  AgentLoopLab,
  AttentionLab,
  ContextMeterLab,
  LstmLab,
  MatrixLab,
  McpFlowLab,
  MoeLab,
  NgramLab,
  SkillCardLab,
  SkillCatalogLab,
  SoftmaxLab,
  TokenizerLab,
} from "./labs/FlatLabs";
import { BenchSvg, BoardSvg, LoopSvg, ShellSvg } from "./labs/PracticeSvgs";
import {
  AdvisorLab,
  EditorLoop,
  FieldPipeline,
  HandsStepper,
  LayerStack,
  PairBoard,
  ProtocolLab,
} from "./labs/ToolLabs";

const loading = <div className="my-8 h-80 animate-pulse rounded-2xl bg-panel" />;
const VectorLab = dynamic(() => import("./labs/VectorLab").then((mod) => mod.VectorLab), { ssr: false, loading: () => loading });
const GradientLab = dynamic(() => import("./labs/GradientLab").then((mod) => mod.GradientLab), { ssr: false, loading: () => loading });
const CloudBoundary = dynamic(() => import("./labs/CloudBoundary").then((mod) => mod.CloudBoundary), { ssr: false, loading: () => loading });

export function WidgetHost({ id, props }: { id: string; props?: Record<string, string> }) {
  if (id === "vector-lab") return <VectorLab />;
  if (id === "matrix-lab") return <MatrixLab />;
  if (id === "softmax-lab") return <SoftmaxLab />;
  if (id === "gradient-lab") return <GradientLab />;
  if (id === "ngram-lab") return <NgramLab />;
  if (id === "lstm-lab") return <LstmLab />;
  if (id === "attention-lab") return <AttentionLab />;
  if (id === "tokenizer-lab") return <TokenizerLab />;
  if (id === "moe-lab") return <MoeLab />;
  if (id === "agent-loop") return <AgentLoopLab />;
  if (id === "context-meter") return <ContextMeterLab />;
  if (id === "mcp-flow") return <McpFlowLab />;
  if (id === "skill-card") return <SkillCardLab />;
  if (id === "skill-catalog") return <SkillCatalogLab />;
  if (id === "editor-loop") return <EditorLoop highlight={props?.highlight} />;
  if (id === "protocol") return <ProtocolLab />;
  if (id === "advisor") return <AdvisorLab />;
  if (id === "pair-board") return <PairBoard />;
  if (id === "cloud") return <CloudBoundary highlight={props?.highlight} />;
  if (id === "hands") return <HandsStepper initial={props?.initial} />;
  if (id === "field") return <FieldPipeline start={props?.start} />;
  if (id === "loop-svg") return <LoopSvg />;
  if (id === "board-svg") return <BoardSvg />;
  if (id === "shell-svg") return <ShellSvg />;
  if (id === "bench-svg") return <BenchSvg />;
  if (id === "layers") return <LayerStack items={props?.items} active={props?.active} />;
  return null;
}
