"use client";

import { useState, type SubmitEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { searchUrl } from "@/lib/searchUrl";

export function useSearchSubmit(initial = "", initialColor: string | null = null) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(initial);
  const [color, setColor] = useState<string | null>(initialColor);

  function go(text: string, c: string | null) {
    const q = text.trim();
    if (q || c) router.push(searchUrl({ q, color: c }));
    else if (pathname === "/search") router.push("/search");
  }

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    go(value, color);
  }

  /** Set (or clear with null) the color and search right away. */
  function applyColor(c: string | null) {
    setColor(c);
    go(value, c);
  }

  return { value, setValue, color, applyColor, onSubmit };
}