"use client";

import { useState } from "react";

type AccordionItem = { label: string; content: string };

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-white/10">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between items-center py-5 text-left"
          >
            <span className="text-sm font-medium text-white tracking-wide">{item.label}</span>
            <span
              className="text-white/50 text-xl flex-shrink-0 ml-4 transition-transform duration-300"
              style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
            >
              +
            </span>
          </button>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{ maxHeight: open === i ? "180px" : "0", opacity: open === i ? 1 : 0 }}
          >
            <p className="pb-5 text-sm text-white/40 leading-relaxed">{item.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
