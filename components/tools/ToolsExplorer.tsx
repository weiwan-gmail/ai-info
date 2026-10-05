"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { groups, pairs, toolChapters } from "@/content/tools";
import { sitePath } from "@/lib/paths";
import { MindMap } from "./MindMap";

const tasks = [
  { id: "repo", label: "改仓库", groups: ["intl", "models", "free"] },
  { id: "office", label: "写办公文件", groups: ["cn", "cloud"] },
  { id: "board", label: "布一块板", groups: ["field", "hands"] },
  { id: "watch", label: "让代理自己值守", groups: ["cloud", "hands"] },
];

export function ToolsExplorer() {
  const searchParams = useSearchParams();
  const focus = searchParams.get("focus") ?? undefined;
  const mode = searchParams.get("mode") ?? undefined;
  const [task, setTask] = useState<string | null>(null);
  const highlight = tasks.find((item) => item.id === task)?.groups ?? [];
  const recent = [...toolChapters]
    .sort((a, b) => (a.updated === b.updated ? 0 : a.updated < b.updated ? 1 : -1))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] tracking-widest text-copper">先选任务</span>
        {tasks.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTask((current) => (current === item.id ? null : item.id))}
            className={`rounded-full px-3 py-1 text-sm ${task === item.id ? "bg-ink text-paper" : "border border-line"}`}
          >
            {item.label}
          </button>
        ))}
        <Link href={mode === "pairs" ? "/tools" : "/tools?mode=pairs"} className="ml-auto rounded-full border border-copper px-3 py-1 text-sm text-copper">
          {mode === "pairs" ? "回到全图" : "只看搭配"}
        </Link>
      </div>
      <div className="rounded-2xl border border-line p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="font-mono text-[11px] tracking-widest text-copper">工具列表</p>
          <p className="text-xs text-ink/50">
            最近写入{" "}
            {recent.map((chapter) => (
              <Link key={chapter.slug} href={`/tools/${chapter.slug}`} className="ml-2 text-ink/70 hover:text-copper">
                {chapter.title}
              </Link>
            ))}
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 xl:grid-cols-7">
          {groups.map((group) => (
            <section key={group.id}>
              <a href={sitePath(`/tools?focus=${group.id}`)} className="text-sm font-medium hover:text-copper">
                {group.title}
              </a>
              <ul className="mt-1 space-y-0.5">
                {toolChapters
                  .filter((chapter) => chapter.group === group.id)
                  .map((chapter) => (
                    <li key={chapter.slug}>
                      <Link href={`/tools/${chapter.slug}`} className="text-sm text-ink/75 hover:text-copper">
                        {chapter.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
      <MindMap groups={groups} chapters={toolChapters} pairs={pairs} focus={focus} mode={mode} highlightGroups={highlight} />
    </div>
  );
}
