import type { Metadata } from "next";
import { ToolsExplorer } from "@/components/tools/ToolsExplorer";

export const metadata: Metadata = {
  title: "工具导图",
  description: "可缩放、可跳转的工具思维导图。模型和代理可以交错搭配，以后也可以继续加章节。",
};

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ focus?: string; mode?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <p className="font-mono text-xs tracking-[0.2em] text-copper">工具</p>
      <h1 className="mt-2 font-serif text-4xl">一张还会长大的导图</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-ink/75">
        实线是从属，虚线是可以交错的搭配。点节点进章节，点分支回到这一枝，点虚线落到搭配章里的那一个例子。
      </p>
      <div className="mt-8">
        <ToolsExplorer focus={params.focus} mode={params.mode} />
      </div>
    </main>
  );
}
