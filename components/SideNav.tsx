"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export type NavItem = { href: string; label: string; group?: string };

export function SideNav({ items, current, title }: { items: NavItem[]; current: string; title: string }) {
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      itemRefs.current[current]?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [current]);

  const groups: { name: string; items: NavItem[] }[] = [];
  for (const item of items) {
    const name = item.group ?? "";
    const found = groups.find((group) => group.name === name);
    if (found) found.items.push(item);
    else groups.push({ name, items: [item] });
  }
  const list = (
    <div className="space-y-3">
      {groups.map((group) => (
        <div key={group.name || "flat"}>
          {group.name ? <p className="mb-0.5 font-mono text-[10px] tracking-widest text-ink/45">{group.name}</p> : null}
          <ul>
            {group.items.map((item) => {
              const active = item.href === current;
              return (
                <li key={item.href}>
                  <Link
                    ref={(node) => {
                      itemRefs.current[item.href] = node;
                    }}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-md px-2 py-0.5 text-[13px] leading-5 ${active ? "bg-ink text-paper" : "text-ink/75 hover:bg-panel"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
  return (
    <aside className="z-30 max-h-[70vh] overflow-auto rounded-2xl border border-line bg-paper/95 p-3 md:sticky md:top-16 md:max-h-[calc(100vh-4.5rem)]">
      <p className="mb-3 font-mono text-[11px] tracking-widest text-copper">{title}</p>
      {list}
    </aside>
  );
}
