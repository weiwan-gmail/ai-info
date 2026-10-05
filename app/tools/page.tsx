import type { Metadata } from "next";
import { Suspense } from "react";
import { SideNav } from "@/components/SideNav";
import { ToolsExplorer } from "@/components/tools/ToolsExplorer";
import { groups, toolChapters } from "@/content/tools";

export const metadata: Metadata = {
  title: "工具导图",
  description: "可缩放、可跳转的工具思维导图。模型和代理可以交错搭配，以后也可以继续加章节。",
};

export default function ToolsPage() {
  return (
    <main className="mx-auto grid max-w-[92rem] items-start gap-6 px-4 py-6 md:grid-cols-[13.5rem_minmax(0,1fr)]">
      <SideNav
        title="全部工具"
        current="/tools"
        items={toolChapters.map((item) => ({
          href: `/tools/${item.slug}`,
          label: item.title,
          group: groups.find((group) => group.id === item.group)?.title,
        }))}
      />
      <div>
        <p className="font-mono text-xs tracking-[0.2em] text-copper">工具</p>
        <h1 className="mt-2 font-serif text-4xl">一张还会长大的导图</h1>
        <p className="mt-3 max-w-3xl leading-7 text-ink/75">
          实线是从属，虚线是可以交错的搭配。点节点进章节，点虚线落到搭配章里的那一个例子。
        </p>
        <div className="mt-6">
          <Suspense fallback={<div className="rounded-2xl border border-line p-6 text-ink/65">正在加载导图…</div>}>
            <ToolsExplorer />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
