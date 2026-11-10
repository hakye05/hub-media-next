import Link from "next/link";

export type SearchType = "posts" | "people" | "collections";

const TABS: { type: SearchType; label: string }[] = [
  { type: "posts", label: "Posts" },
  { type: "people", label: "People" },
  { type: "collections", label: "Collections" },
];

type Props = { q: string; color: string | null; active: SearchType };

export default function SearchTabs({ q, color, active }: Props) {
  return (
    <nav
      aria-label="Search sections"
      className="inline-flex rounded-full border border-neutral-300/70 p-1"
    >
      {TABS.map((t) => (
        <Link
          key={t.type}
          href={`/search?q=${encodeURIComponent(q)}&type=${t.type}`}
          replace
          scroll={false}
          aria-current={active === t.type ? "page" : undefined}
          className={`inline-flex h-10 items-center rounded-full px-5 text-[15px] font-semibold tracking-tight transition-colors ${
            active === t.type
              ? "bg-neutral-200/70 text-neutral-900"
              : "text-neutral-500 hover:text-neutral-900"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}