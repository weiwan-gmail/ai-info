"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/learn/vectors", label: "模型", match: "/learn" },
  { href: "/learn/agent-loop", label: "智能体", match: "/learn/agent" },
  { href: "/tools", label: "工具导图", match: "/tools" },
];

export function SiteHeader() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="font-serif text-xl tracking-wide text-ink">
          逐问
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((link) => {
            const active =
              link.match === "/learn/agent"
                ? path.startsWith("/learn/agent") ||
                  path.startsWith("/learn/context") ||
                  path.startsWith("/learn/tools") ||
                  path.startsWith("/learn/mcp") ||
                  path.startsWith("/learn/skill")
                : link.match === "/learn"
                  ? path.startsWith("/learn") &&
                    !path.startsWith("/learn/agent") &&
                    !path.startsWith("/learn/context") &&
                    !path.startsWith("/learn/tools") &&
                    !path.startsWith("/learn/mcp") &&
                    !path.startsWith("/learn/skill")
                  : path.startsWith(link.match);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 ${active ? "bg-ink text-paper" : "text-ink/70 hover:text-ink"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
