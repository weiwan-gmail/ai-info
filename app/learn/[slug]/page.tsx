import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChapterView } from "@/components/ChapterView";
import { SideNav } from "@/components/SideNav";
import { getLesson, lessons } from "@/content/lessons";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  return { title: lesson?.title ?? "未找到", description: lesson?.summary };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = lessons.findIndex((lesson) => lesson.slug === slug);
  const lesson = lessons[index];
  if (!lesson) notFound();
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[220px_1fr]">
      <SideNav
        title="十二课"
        current={`/learn/${lesson.slug}`}
        items={lessons.map((item) => ({
          href: `/learn/${item.slug}`,
          label: item.title,
          group: Number(item.kicker.slice(0, 2)) <= 6 ? "模型" : Number(item.kicker.slice(0, 2)) <= 9 ? "智能体" : "MCP 与技能",
        }))}
      />
      <ChapterView
        article={lesson}
        prev={prev ? { href: `/learn/${prev.slug}`, title: prev.title } : null}
        next={next ? { href: `/learn/${next.slug}`, title: next.title } : { href: "/tools", title: "打开工具导图" }}
      />
    </main>
  );
}
