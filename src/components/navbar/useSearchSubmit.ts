"use client";

import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";

export function useSearchSubmit(initial = "") {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = value.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return { value, setValue, onSubmit };
}