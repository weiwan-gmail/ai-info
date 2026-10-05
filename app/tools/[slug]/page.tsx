import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChapterView } from "@/components/ChapterView";
import { HashScroll } from "@/components/HashScroll";
import { SideNav } from "@/components/SideNav";
import { getTool, groups, toolChapters } from "@/content/tools";

export function generateStaticParams() {
  return toolChapters.map((chapter) => ({ slug: chapter.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const chapter = getTool(slug);
  return { title: chapter?.title ?? "未找到", description: chapter?.summary };
}

export default async function ToolChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = toolChapters.findIndex((chapter) => chapter.slug === slug);
  const chapter = toolChapters[index];
  if (!chapter) notFound();
  const prev = toolChapters[index - 1];
  const next = toolChapters[index + 1];
  const groupTitle = groups.find((group) => group.id === chapter.group)?.title ?? "";
  return (
    <main className="mx-auto grid max-w-[92rem] items-start gap-6 px-4 py-6 md:grid-cols-[13.5rem_minmax(0,1fr)]">
      <HashScroll />
      <SideNav
        title="工具导图"
        current={`/tools/${chapter.slug}`}
        items={toolChapters.map((item) => ({
          href: `/tools/${item.slug}`,
          label: item.title,
          group: groups.find((group) => group.id === item.group)?.title,
        }))}
      />
      <ChapterView
        article={chapter}
        eyebrow={`${groupTitle} · 更新于 ${chapter.updated}`}
        prev={prev ? { href: `/tools/${prev.slug}`, title: prev.title } : { href: "/tools", title: "回到导图" }}
        next={next ? { href: `/tools/${next.slug}`, title: next.title } : null}
      >
        <p className="mt-8">
          <Link href={`/tools?focus=${chapter.slug}`} className="text-sm text-copper">
            在导图中定位这一章
          </Link>
        </p>
      </ChapterView>
    </main>
  );
}
