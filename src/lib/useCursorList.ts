"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import type { CursorPage } from "@/lib/pagination";

type State<T> = {
  items: T[];
  nextCursor: string | null;
  initialized: boolean;
  loading: boolean;
  error: string | null;
};

const initial = <T,>(): State<T> => ({
  items: [],
  nextCursor: null,
  initialized: false,
  loading: true,
  error: null,
});

/**
 * Cursor-paginated list. `fetchPage` must be referentially stable
 * (module-level function or useCallback); passing a new one, or remounting
 * via `key`, starts a fresh list.
 */
export function useCursorList<T extends { id: string }>(
  fetchPage: (cursor: string | null) => Promise<CursorPage<T>>
) {
  const [state, setState] = useState<State<T>>(initial);
  const [attempt, setAttempt] = useState(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    let active = true;
    fetchPage(null)
      .then(
        (page) =>
          active &&
          setState({
            items: page.items,
            nextCursor: page.nextCursor,
            initialized: true,
            loading: false,
            error: null,
          })
      )
      .catch(
        (err) =>
          active && setState((s) => ({ ...s, loading: false, error: getErrorMessage(err) }))
      );
    return () => {
      active = false;
    };
  }, [fetchPage, attempt]);

  const loadPage = useCallback(
    async (cursor: string) => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const page = await fetchPage(cursor);
        setState((s) => {
          const seen = new Set(s.items.map((i) => i.id));
          return {
            items: [...s.items, ...page.items.filter((i) => !seen.has(i.id))],
            nextCursor: page.nextCursor,
            initialized: true,
            loading: false,
            error: null,
          };
        });
      } catch (err) {
        setState((s) => ({ ...s, loading: false, error: getErrorMessage(err) }));
      }
    },
    [fetchPage]
  );

  // State is read through a ref so loadMore's identity stays stable: the
  // sentinel re-observes whenever it changes, and an errored page must not
  // auto-retry in a loop — only `retry` clears the error.
  const loadMore = useCallback(() => {
    const s = stateRef.current;
    if (s.loading || s.error || !s.nextCursor) return;
    void loadPage(s.nextCursor);
  }, [loadPage]);

  const retry = useCallback(() => {
    const s = stateRef.current;
    if (!s.initialized) {
      setState(initial<T>());
      setAttempt((a) => a + 1);
      return;
    }
    if (s.nextCursor) void loadPage(s.nextCursor);
  }, [loadPage]);

  const add = useCallback(
    (item: T) =>
      setState((s) => ({ ...s, items: [item, ...s.items.filter((i) => i.id !== item.id)] })),
    []
  );

  const remove = useCallback(
    (id: string) => setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) })),
    []
  );

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    hasMore: state.nextCursor !== null,
    loadMore,
    retry,
    add,
    remove,
  };
}