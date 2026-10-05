import type { PairLink, ToolGroup } from "@/lib/types";
import { cloudChapters, handChapters } from "./cloud";
import { domesticChapters, freeChapters } from "./domestic";
import { fieldChapters } from "./field";
import { intlChapters } from "./intl";
import { modelChapters } from "./models";
import { pairingChapter } from "./pairing";
import { priceCards } from "./prices";
import { sheets } from "./sheets";

export const groups: ToolGroup[] = [
  { id: "intl", title: "国际助手", question: "改仓库时，代理住在哪一层？" },
  { id: "models", title: "国内模型", question: "燃料从哪来，车子是谁的？" },
  { id: "cn", title: "国内产品", question: "开箱就能用的客户端差在哪？" },
  { id: "free", title: "免费", question: "不另买订阅时，代价在哪？" },
  { id: "cloud", title: "云端代理", question: "电脑在谁那里？" },
  { id: "hands", title: "动手方式", question: "它是在调接口，还是在点屏幕？" },
  { id: "field", title: "工程现场", question: "规格、板子、外壳和波形怎么交手？" },
];

export const pairs: PairLink[] = [
  { agent: "claude-code", provider: "deepseek", anchor: "pair-claude-code-deepseek", label: "兼容端点" },
  { agent: "claude-code", provider: "glm", anchor: "pair-claude-code-glm", label: "兼容端点" },
  { agent: "claude-code", provider: "kimi", anchor: "pair-claude-code-kimi", label: "兼容端点" },
  { agent: "opencode", provider: "kimi", anchor: "pair-opencode-kimi", label: "读长材料" },
  { agent: "opencode", provider: "deepseek", anchor: "pair-opencode-deepseek", label: "改代码" },
  { agent: "opencode", provider: "glm", anchor: "pair-opencode-any", label: "任意兼容接口" },
  { agent: "opencode", provider: "ollama", anchor: "pair-opencode-ollama", label: "留在本机" },
  { agent: "cursor", provider: "deepseek", anchor: "pair-cursor-custom", label: "自定义模型" },
  { agent: "cursor", provider: "glm", anchor: "pair-cursor-custom", label: "自定义模型" },
  { agent: "cursor", provider: "kimi", anchor: "pair-cursor-custom", label: "自定义模型" },
  { agent: "workbuddy", provider: "deepseek", anchor: "pair-workbuddy-switch", label: "models.json" },
  { agent: "workbuddy", provider: "glm", anchor: "pair-workbuddy-switch", label: "models.json" },
  { agent: "workbuddy", provider: "kimi", anchor: "pair-workbuddy-switch", label: "models.json" },
  { agent: "chatgpt-codex", provider: "deepseek", anchor: "pair-chatgpt-custom", label: "自定义提供方" },
  { agent: "chatgpt-codex", provider: "glm", anchor: "pair-chatgpt-custom", label: "自定义提供方" },
  { agent: "chatgpt-codex", provider: "kimi", anchor: "pair-chatgpt-custom", label: "自定义提供方" },
  { agent: "zcode", provider: "glm", anchor: "pair-zcode-glm", label: "默认燃料" },
  { agent: "zcode", provider: "deepseek", anchor: "pair-zcode-custom", label: "模型设置" },
  { agent: "zcode", provider: "kimi", anchor: "pair-zcode-custom", label: "模型设置" },
];

export const toolChapters = [
  ...intlChapters,
  ...modelChapters,
  pairingChapter,
  ...domesticChapters,
  ...freeChapters,
  ...cloudChapters,
  ...handChapters,
  ...fieldChapters,
].map((chapter) => ({
  ...chapter,
  updated: chapter.updated || "2026-10-05",
  blocks:
    chapter.group === "field"
      ? chapter.blocks
      : [...(priceCards[chapter.slug] ?? []), ...chapter.blocks, ...(sheets[chapter.slug] ?? [])],
}));

export function getTool(slug: string) {
  return toolChapters.find((chapter) => chapter.slug === slug);
}
