import { h2, links, p, widget } from "@/lib/blocks";
import type { Block, ToolChapter, ToolRole } from "@/lib/types";

export function tool(input: {
  slug: string;
  group: string;
  title: string;
  question: string;
  summary: string;
  blurb: string;
  role: ToolRole;
  kicker: string;
  opening: string;
  stuck: string;
  layers: string;
  task: string;
  model: string;
  data: string;
  neighbor: string;
  switchWhen: string;
  widgets?: Block[];
  more?: Block[];
  updated?: string;
}): ToolChapter {
  return {
    slug: input.slug,
    group: input.group,
    title: input.title,
    question: input.question,
    summary: input.summary,
    blurb: input.blurb,
    role: input.role,
    kicker: input.kicker,
    updated: input.updated ?? "2026-10-05",
    blocks: [
      h2(input.opening),
      p(input.stuck),
      h2("它分成哪几层"),
      p(input.layers),
      ...(input.widgets ?? []),
      h2("一次任务怎么走"),
      p(input.task),
      h2("模型从哪来"),
      p(input.model),
      h2("数据留在哪"),
      p(input.data),
      h2("和邻章差在哪"),
      p(input.neighbor),
      h2("什么时候该换"),
      p(input.switchWhen),
      ...(input.more ?? []),
    ],
  };
}

export { h2, links, p, widget };
