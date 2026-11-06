"use client";

import Image from "next/image";
import ColorDots from "../ui/ColorDots";
import { useSearchSubmit } from "./useSearchSubmit";

export default function SearchBar({ initialValue = "" }: { initialValue?: string }) {
  const { value, setValue, onSubmit } = useSearchSubmit(initialValue);

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className="flex w-full max-w-160 items-center gap-2 rounded-full border border-neutral-300/70 bg-neutral-200/40 p-2"
    >
      {/* Input pill */}
      <label className="flex h-16 flex-1 items-center gap-3 rounded-full bg-white px-5 shadow-sm">
        <Image src="/search.svg" alt="" width={28} height={28} />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          enterKeyHint="search"
          aria-label="Search"
          placeholder="Search posts and people"
          className="w-full bg-transparent text-[19px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
        />
      </label>

      {/* Round multicolor button */}
      <button
        type="button"
        aria-label="Visual search"
        className="relative h-16 w-16 shrink-0 rounded-full bg-white shadow-sm transition-transform hover:scale-105"
      >
        <ColorDots dotClassName="h-1.5 w-1.5" radius={10} />
      </button>
    </form>
  );
}