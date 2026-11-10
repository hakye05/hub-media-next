"use client";

import { useCallback, useRef, useState } from "react";
import { useDismissable } from "@/components/ui/useDismissable";

export function useColorPopover() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);
  useDismissable(ref, open, close);
  return { ref, open, toggle, close };
}