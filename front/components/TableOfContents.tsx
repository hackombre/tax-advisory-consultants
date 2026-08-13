"use client";

import { useEffect, useState } from "react";
import { TocItem } from "@/lib/toc";

export default function TableOfContents({
  items,
  title,
}: {
  items: TocItem[];
  title: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-28 hidden max-h-[calc(100vh-8rem)] w-64 flex-shrink-0 overflow-y-auto lg:block">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-navy/40">
        {title}
      </p>
      <ul className="space-y-1 border-l border-navy/10">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block border-l-2 py-1 pl-4 text-sm transition-colors ${
                item.level === 3 ? "pl-7 text-xs" : ""
              } ${
                activeId === item.id
                  ? "border-accent font-medium text-accent"
                  : "border-transparent text-navy/50 hover:text-navy"
              }`}
              style={{ marginLeft: "-1px" }}
            >
              <span className="mr-1 text-navy/30">{item.number}</span>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
