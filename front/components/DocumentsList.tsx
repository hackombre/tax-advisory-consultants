import { PostDocument } from "@/lib/posts";

function extOf(name: string) {
  const parts = name.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
}

export default function DocumentsList({
  documents,
  title,
}: {
  documents: PostDocument[];
  title: string;
}) {
  if (documents.length === 0) return null;

  return (
    <div className="mt-10 rounded-2xl border border-navy/10 bg-navy/[0.03] p-6">
      <h3 className="font-display mb-4 text-lg font-semibold text-navy">{title}</h3>
      <ul className="space-y-2">
        {documents.map((doc) => (
          <li key={doc.id}>
            <a
              href={doc.url}
              download
              className="group flex items-center gap-3 rounded-xl border border-navy/10 bg-white px-4 py-3 transition-colors hover:border-accent/40"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-navy/[0.06] text-[10px] font-bold text-navy/60">
                {extOf(doc.name)}
              </span>
              <span className="flex-1 truncate text-sm font-medium text-navy group-hover:text-accent">
                {doc.name}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="flex-shrink-0 text-navy/40 group-hover:text-accent"
              >
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 20h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
