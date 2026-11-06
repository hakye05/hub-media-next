"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import type { CursorPage } from "@/lib/pagination";

/** Loads the first page on mount. Remount (change `key`) to reset. */
export function useCursorList<T extends { id: string }>(
  load: (cursor: string | null) => Promise<CursorPage<T>>
) {
  const [items, setItems] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cursor = useRef<string | null>(null);
  const busy = useRef(false);
  const started = useRef(false);
  const loadRef = useRef(load);

  useEffect(() => {
    loadRef.current = load;
  });

  const loadMore = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setLoading(true);
    setError(null);
    try {
      const page = await loadRef.current(cursor.current);
      cursor.current = page.nextCursor;
      setItems((prev) => {
        const seen = new Set(prev.map((i) => i.id));
        return [...prev, ...page.items.filter((i) => !seen.has(i.id))];
      });
      setHasMore(page.nextCursor !== null);
    } catch (err) {
      setError(getErrorMessage(err));
      setHasMore(false);
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void loadMore();
  }, [loadMore]);

  return { items, hasMore, loading, error, loadMore };
}