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
      className="flex h-10 w-full items-center gap-2 rounded-full border border-neutral-300/70 bg-white/60 pl-4 pr-3 sm:h-12 sm:gap-3 sm:pl-5 sm:pr-4 transition-colors focus-within:bg-white"
    >
      <Image src="/search.svg" alt="" width={22} height={22} />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        enterKeyHint="search"
        aria-label="Search"
        placeholder="Search"
        className="min-w-0 flex-1 bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
      />

      <button
        type="button"
        aria-label="Visual search"
        className="relative hidden h-6 w-6 shrink-0 transition-transform hover:scale-110 sm:block"
      >
        <ColorDots dotClassName="h-1 w-1" radius={8} />
      </button>
    </form>
  );
}