export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
  number: string;
}

function slugify(text: string, used: Map<string, number>): string {
  const base =
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "section";

  const count = used.get(base) ?? 0;
  used.set(base, count + 1);
  return count === 0 ? base : `${base}-${count}`;
}

/**
 * Walks the h2/h3 elements inside a rendered content container, assigns them
 * stable ids (for anchor links), and returns a numbered table of contents
 * mirroring the CSS counters used to number the headings visually.
 */
export function extractToc(container: HTMLElement): TocItem[] {
  const headings = Array.from(container.querySelectorAll<HTMLElement>("h2, h3"));
  const used = new Map<string, number>();
  const toc: TocItem[] = [];
  let major = 0;
  let minor = 0;

  headings.forEach((el) => {
    const level: 2 | 3 = el.tagName === "H2" ? 2 : 3;
    const text = el.textContent?.trim() ?? "";
    if (!text) return;

    const id = slugify(text, used);
    el.id = id;

    let number: string;
    if (level === 2) {
      major += 1;
      minor = 0;
      number = `${major}`;
    } else {
      minor += 1;
      number = `${major || 1}.${minor}`;
    }

    toc.push({ id, text, level, number });
  });

  return toc;
}
