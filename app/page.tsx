import Link from "next/link";
import { HeroCanvas } from "@/components/HeroCanvas";
import { lessons } from "@/content/lessons";
import { groups, toolChapters } from "@/content/tools";

const paths = [
  {
    href: "/learn/vectors",
    kicker: "模型",
    title: "技术是被问题逼出来的",
    body: "从向量和损失走到注意力。每一课先给最小的办法，再看它在哪里失败。",
  },
  {
    href: "/learn/agent-loop",
    kicker: "智能体",
    title: "一次回车之后的循环",
    body: "计划、工具、上下文、MCP 和技能。会接话的模型，要怎样才开始改文件。",
  },
  {
    href: "/tools",
    kicker: "工具导图",
    title: "模型和代理可以交错",
    body: "一张能缩放、能跳转、以后还能加节点的导图。Provider 是燃料，Agent 是车。",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="relative h-[78vh] min-h-[560px] bg-night text-paper">
        <div className="absolute inset-0">
          <HeroCanvas />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-6xl px-5 pb-12">
          <p className="font-mono text-xs tracking-[0.22em] text-[#e3b15a]">一系列教程</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-tight sm:text-6xl">从问题走到智能体</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-paper/80">
            没有人一开始就想到 Transformer。先遇到一个具体的问题，用最朴素的办法碰壁，再把那个办法改成后来的术语。
          </p>
          <div className="pointer-events-auto mt-6 flex flex-wrap gap-3">
            <Link href="/learn/vectors" className="rounded-full bg-[#e3b15a] px-5 py-2 text-night">
              从向量开始
            </Link>
            <Link href="/tools" className="rounded-full border border-paper/30 px-5 py-2">
              打开工具导图
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-5 py-14 md:grid-cols-3">
        {paths.map((path) => (
          <Link key={path.href} href={path.href} className="rounded-2xl border border-line bg-sand p-5 hover:border-copper">
            <p className="font-mono text-[11px] tracking-[0.18em] text-copper">{path.kicker}</p>
            <h2 className="mt-2 font-serif text-2xl">{path.title}</h2>
            <p className="mt-3 text-sm leading-7 text-ink/75">{path.body}</p>
          </Link>
        ))}
      </section>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 pb-8 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-serif text-3xl">{lessons.length} 课，按死结排列</h2>
          <ol className="mt-6 space-y-3">
            {lessons.map((lesson) => (
              <li key={lesson.slug}>
                <Link href={`/learn/${lesson.slug}`} className="grid grid-cols-[4.5rem_1fr] gap-3 rounded-xl border border-transparent px-2 py-2 hover:border-line">
                  <span className="font-mono text-xs text-copper">{lesson.kicker.split("·")[0]}</span>
                  <span>
                    <span className="font-medium">{lesson.title}</span>
                    <span className="mt-1 block text-sm text-ink/65">{lesson.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <aside className="rounded-2xl border border-line bg-panel p-5">
          <h2 className="font-serif text-2xl">导图上的七条枝</h2>
          <ul className="mt-4 space-y-3">
            {groups.map((group) => (
              <li key={group.id}>
                <Link href={`/tools?focus=${group.id}`} className="font-medium hover:text-copper">
                  {group.title}
                </Link>
                <p className="text-sm text-ink/65">
                  {group.question} {toolChapters.filter((chapter) => chapter.group === group.id).length} 章
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
