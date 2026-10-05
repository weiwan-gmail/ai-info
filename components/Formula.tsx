import katex from "katex";

export function Formula({ tex, caption }: { tex: string; caption?: string }) {
  const html = katex.renderToString(tex, { throwOnError: false, displayMode: true });
  return (
    <figure className="my-6 overflow-x-auto rounded-xl border border-line bg-sand px-4 py-3">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {caption ? <figcaption className="mt-2 text-center text-sm text-ink/60">{caption}</figcaption> : null}
    </figure>
  );
}
