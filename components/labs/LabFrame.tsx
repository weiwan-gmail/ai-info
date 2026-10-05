export function LabFrame({
  title,
  hint,
  children,
  footer,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <figure className="my-8 overflow-hidden rounded-2xl border border-line bg-panel">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-4 py-3">
        <span className="font-mono text-[11px] tracking-[0.18em] text-copper">{title}</span>
        {hint ? <span className="text-xs text-ink/55">{hint}</span> : null}
      </figcaption>
      <div className="bg-sand">{children}</div>
      {footer ? <div className="border-t border-line px-4 py-3 text-sm leading-6">{footer}</div> : null}
    </figure>
  );
}
