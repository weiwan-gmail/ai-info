"use client";

import Link from "next/link";
import { useState } from "react";
import { groups, pairs, toolChapters } from "@/content/tools";
import { MindMap } from "./MindMap";

const tasks = [
  { id: "repo", label: "改仓库", groups: ["intl", "models", "free"] },
  { id: "office", label: "写办公文件", groups: ["cn", "cloud"] },
  { id: "board", label: "布一块板", groups: ["field", "hands"] },
  { id: "watch", label: "让代理自己值守", groups: ["cloud", "hands"] },
];

export function ToolsExplorer({ focus, mode }: { focus?: string; mode?: string }) {
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
      <MindMap groups={groups} chapters={toolChapters} pairs={pairs} focus={focus} mode={mode} highlightGroups={highlight} />
      <div className="grid gap-6 lg:grid-cols-[1fr_16rem]">
        <div className="rounded-2xl border border-line p-4">
          <p className="font-mono text-[11px] tracking-widest text-copper">文字树</p>
          <div className="mt-3 columns-1 gap-8 sm:columns-2">
            {groups.map((group) => (
              <section key={group.id} className="mb-4 break-inside-avoid">
                <a href={`/tools?focus=${group.id}`} className="font-medium hover:text-copper">
                  {group.title}
                </a>
                <ul className="mt-1 space-y-1">
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
        <aside className="rounded-2xl border border-line p-4">
          <p className="font-mono text-[11px] tracking-widest text-copper">最近更新</p>
          <ul className="mt-3 space-y-3">
            {recent.map((chapter) => (
              <li key={chapter.slug}>
                <Link href={`/tools/${chapter.slug}`} className="text-sm hover:text-copper">
                  {chapter.title}
                </Link>
                <p className="font-mono text-[11px] text-ink/45">{chapter.updated}</p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-5 text-ink/55">新的一章是注册表里的一个节点。新的搭配只加一条虚线。改旧章时改日期，这里会跟着变。</p>
        </aside>
      </div>
    </div>
  );
}
