export type WidgetBlock = {
  type: "widget";
  id: string;
  props?: Record<string, string>;
};

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id?: string }
  | { type: "ul"; items: string[] }
  | { type: "formula"; tex: string; caption?: string }
  | { type: "callout"; title: string; text: string }
  | { type: "steps"; items: { title: string; body: string }[] }
  | { type: "links"; items: { href: string; label: string }[] }
  | WidgetBlock;

export type Article = {
  slug: string;
  kicker: string;
  title: string;
  question: string;
  summary: string;
  blocks: Block[];
};

export type ToolRole = "agent" | "provider" | "method" | "field" | "guide";

export type ToolChapter = Article & {
  group: string;
  updated: string;
  role: ToolRole;
  blurb: string;
};

export type ToolGroup = {
  id: string;
  title: string;
  question: string;
};

export type PairLink = {
  agent: string;
  provider: string;
  anchor: string;
  label: string;
};
