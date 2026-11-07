import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import ColorDots from "../ui/ColorDots";
import { useSearchSubmit } from "../search/useSearchSubmit";

export default function NavSearch() {
  const pathname = usePathname();
  const params = useSearchParams();
  const q = pathname === "/search" ? (params.get("q") ?? "").trim() : "";

  // key remounts the form when the query changes, so the input always shows the searched word
  return <NavSearchForm key={q} initialValue={q} />;
}

function NavSearchForm({ initialValue }: { initialValue: string }) {
  const { value, setValue, onSubmit } = useSearchSubmit(initialValue);

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="flex h-12 w-full items-center gap-3 rounded-full border border-neutral-300/70 bg-white/60 pl-5 pr-4 transition-colors focus-within:bg-white"
    >
      <Image src="/search.svg" alt="" width={22} height={22} />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        enterKeyHint="search"
        aria-label="Search"
        placeholder="Try 'traditional pottery techniques'"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
      />

      <button
        type="button"
        aria-label="Search by image"
        className="text-neutral-500 transition-colors hover:text-neutral-900"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Visual search"
        className="relative h-6 w-6 shrink-0 transition-transform hover:scale-110"
      >
        <ColorDots dotClassName="h-1 w-1" radius={8} />
      </button>
    </form>
  );
}