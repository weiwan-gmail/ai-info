import Link from "next/link";

export type NavItem = { href: string; label: string; group?: string };

export function SideNav({ items, current, title }: { items: NavItem[]; current: string; title: string }) {
  const groups: { name: string; items: NavItem[] }[] = [];
  for (const item of items) {
    const name = item.group ?? "";
    const found = groups.find((group) => group.name === name);
    if (found) found.items.push(item);
    else groups.push({ name, items: [item] });
  }
  const list = (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.name || "flat"}>
          {group.name ? <p className="mb-1 font-mono text-[11px] tracking-widest text-ink/45">{group.name}</p> : null}
          <ul className="space-y-1">
            {group.items.map((item) => {
              const active = item.href === current;
              return (
                <li key={item.href}>
                  <Link href={item.href} className={`block rounded-lg px-2 py-1 text-sm ${active ? "bg-ink text-paper" : "text-ink/75 hover:bg-panel"}`}>
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
    <aside>
      <details className="mb-6 rounded-xl border border-line bg-sand md:hidden">
        <summary className="cursor-pointer px-4 py-3 text-sm">{title}</summary>
        <div className="px-3 pb-3">{list}</div>
      </details>
      <div className="sticky top-20 hidden max-h-[calc(100vh-6rem)] overflow-auto md:block">
        <p className="mb-3 font-mono text-[11px] tracking-widest text-copper">{title}</p>
        {list}
      </div>
    </aside>
  );
}
