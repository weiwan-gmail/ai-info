import Link from "next/link";
import { assetPath } from "@/lib/paths";
import type { Article, Block } from "@/lib/types";
import { Formula } from "./Formula";
import { WidgetHost } from "./WidgetHost";

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-lab">
      {blocks.map((block, index) => {
        if (block.type === "p") return <p key={index}>{block.text}</p>;
        if (block.type === "h2")
          return (
            <h2 key={index} id={block.id}>
              {block.text}
            </h2>
          );
        if (block.type === "ul")
          return (
            <ul key={index} className="mt-4 list-disc space-y-2 pl-5">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        if (block.type === "formula") return <Formula key={index} tex={block.tex} caption={block.caption} />;
        if (block.type === "callout")
          return (
            <aside key={index} className="my-6 border-l-2 border-copper bg-panel/70 px-4 py-3">
              <p className="font-mono text-xs tracking-widest text-copper">{block.title}</p>
              <p className="mt-1">{block.text}</p>
            </aside>
          );
        if (block.type === "steps")
          return (
            <ol key={index} className="mt-4 space-y-3">
              {block.items.map((step, stepIndex) => (
                <li key={step.title} className="grid grid-cols-[auto_1fr] gap-3">
                  <span className="font-mono text-sm text-copper">{String(stepIndex + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="font-medium">{step.title}</span>
                    <span className="mt-1 block text-ink/80">{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          );
        if (block.type === "links")
          return (
            <p key={index} className="mt-4 flex flex-wrap gap-2">
              {block.items.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-full border border-line bg-sand px-3 py-1 text-sm text-copper hover:border-copper">
                  {item.label}
                </Link>
              ))}
            </p>
          );
        if (block.type === "table")
          return (
            <div key={index} className="my-6 overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[36rem] border-collapse text-sm">
                <thead>
                  <tr className="bg-panel text-left">
                    {block.headers.map((header) => (
                      <th key={header} className="px-3 py-2 font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t border-line">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 align-top">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        if (block.type === "figure")
          return (
            <figure key={index} className="my-6 overflow-hidden rounded-2xl border border-line bg-sand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={assetPath(block.src)} alt={block.alt} className="max-h-[640px] w-full bg-white object-contain object-top" />
              {block.caption ? <figcaption className="border-t border-line px-4 py-2 text-sm text-ink/60">{block.caption}</figcaption> : null}
            </figure>
          );
        if (block.type === "widget") return <WidgetHost key={index} id={block.id} props={block.props} />;
        return null;
      })}
    </div>
  );
}

export function ChapterView({
  article,
  eyebrow,
  prev,
  next,
  children,
}: {
  article: Article;
  eyebrow?: string;
  prev?: { href: string; title: string } | null;
  next?: { href: string; title: string } | null;
  children?: React.ReactNode;
}) {
  return (
    <article className="max-w-[68ch]">
      <p className="font-mono text-xs tracking-[0.2em] text-copper">{eyebrow ?? article.kicker}</p>
      <h1 className="mt-2 font-serif text-4xl leading-tight text-ink">{article.title}</h1>
      <p className="mt-4 border-l-2 border-brass pl-4 text-lg leading-8 text-ink/80">{article.question}</p>
      <Blocks blocks={article.blocks} />
      {children}
      <nav className="mt-12 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
        {prev ? (
          <Link href={prev.href} className="rounded-xl border border-line px-4 py-3 hover:border-copper">
            <span className="block text-xs text-ink/50">上一章</span>
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={next.href} className="rounded-xl border border-line px-4 py-3 text-right hover:border-copper">
            <span className="block text-xs text-ink/50">下一章</span>
            {next.title}
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
