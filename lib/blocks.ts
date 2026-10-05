import type { Block } from "./types";

export const p = (text: string): Block => ({ type: "p", text });
export const h2 = (text: string, id?: string): Block => ({ type: "h2", text, id });
export const ul = (items: string[]): Block => ({ type: "ul", items });
export const callout = (title: string, text: string): Block => ({ type: "callout", title, text });
export const widget = (id: string, props?: Record<string, string>): Block => ({ type: "widget", id, props });
export const links = (items: { href: string; label: string }[]): Block => ({ type: "links", items });
export const formula = (tex: string, caption?: string): Block => ({ type: "formula", tex, caption });
export const steps = (items: { title: string; body: string }[]): Block => ({ type: "steps", items });
