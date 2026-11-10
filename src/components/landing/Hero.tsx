"use client";

import { useAuthModal } from "../auth/AuthModalProvider";
import SearchBar from "../search/SearchBar";

export default function Hero() {
  const { openAuth } = useAuthModal();

  return (
    <main className="flex min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-90px)] flex-col items-center justify-center gap-6 px-4 pb-16 sm:gap-10 sm:px-6 sm:pb-24">
      <h1 className="text-center text-[32px] font-bold leading-[1.1] tracking-tighter sm:text-6xl md:text-7xl">
        <span className="block">Get started with</span>
        <span className="mt-1 inline-flex items-center gap-4">
          your exploration
          {/* Decorative placeholder tiles */}
          <span className="relative hidden h-17 w-26 sm:block" aria-hidden>
            <span className="absolute left-0 top-1 h-16 w-16 -rotate-6 rounded-2xl bg-linear-to-br from-amber-800 to-stone-900 shadow-md" />
            <span className="absolute right-0 top-0 h-16 w-16 rotate-3 rounded-2xl bg-linear-to-br from-neutral-800 to-black shadow-md" />
          </span>
        </span>
      </h1>

      <SearchBar pickerAbove />

      <button
        type="button"
        onClick={() => openAuth("signup")}
        className="inline-flex h-11 items-center justify-center rounded-full bg-[#111] px-5 pb-px text-[14px] font-semibold leading-none text-white transition-colors hover:bg-neutral-800 sm:h-14 sm:px-6 sm:text-[15px]"
      >
        Join HAKYE-HUB for free
      </button>
    </main>
  );
}