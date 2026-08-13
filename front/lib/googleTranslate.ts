import { parse, NodeType } from "node-html-parser";

/**
 * Translates plain text using Google Translate's public "gtx" endpoint.
 * No API key required. Intended for short/medium admin-authored content
 * (titles, excerpts, paragraph fragments) — not for bulk/production-scale use.
 */
export async function translateText(
  text: string | undefined,
  target: string,
  source = "fr"
): Promise<string> {
  const trimmed = text?.trim();
  if (!trimmed) return text ?? "";

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(
    trimmed
  )}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) {
    throw new Error(`Google Translate a répondu ${res.status}`);
  }

  const data = (await res.json()) as unknown[];
  const segments = (data[0] ?? []) as [string, string][];
  const translated = segments.map((seg) => seg[0]).join("");

  // Preserve original surrounding whitespace so word-boundaries in the
  // original HTML aren't lost (e.g. a trailing space before a link).
  const leading = text?.match(/^\s*/)?.[0] ?? "";
  const trailing = text?.match(/\s*$/)?.[0] ?? "";
  return leading + translated + trailing;
}

/**
 * Translates an HTML fragment (as produced by the rich text editor) while
 * preserving every tag, attribute, class and URL — only the visible text
 * nodes are sent for translation.
 */
export async function translateHtml(
  html: string | undefined,
  target: string,
  source = "fr"
): Promise<string> {
  if (!html?.trim()) return html ?? "";

  const root = parse(html, { comment: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textNodes: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function walk(node: any) {
    for (const child of node.childNodes ?? []) {
      if (child.nodeType === NodeType.TEXT_NODE) {
        if (child.rawText && child.rawText.trim()) {
          textNodes.push(child);
        }
      } else if (child.nodeType === NodeType.ELEMENT_NODE) {
        walk(child);
      }
    }
  }
  walk(root);

  await Promise.all(
    textNodes.map(async (node) => {
      try {
        node.rawText = await translateText(node.rawText, target, source);
      } catch {
        // Leave the original text for this node if its translation call failed.
      }
    })
  );

  return root.toString();
}
