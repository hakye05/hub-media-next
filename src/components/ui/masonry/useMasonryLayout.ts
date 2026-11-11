"use client";

import { useMemo, useRef } from "react";
import type { MasonryLayout } from "./types";
import { placeItems } from "./placeItems";

/** getId and getRatio must be referentially stable (define them at module level). */
export function useMasonryLayout<T>(
  items: T[],
  columnCount: number,
  getId: (item: T) => string,
  getRatio: (item: T) => number,
  overhead = 0
): MasonryLayout<T> {
  const prev = useRef<MasonryLayout<T> | null>(null);

  return useMemo(() => {
    const entries = items.map((data) => ({
      id: getId(data),
      ratio: getRatio(data) + overhead,
      data,
    }));
    const next = placeItems(prev.current, entries, columnCount);
    prev.current = next;
    return next;
  }, [items, columnCount, getId, getRatio, overhead]);
}