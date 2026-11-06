import { useCallback, useEffect, useState } from "react";
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

/** `fetchPage` must be referentially stable; remount (key) to start a fresh list. */
export function useCursorList<T extends { id: string }>(
  fetchPage: (cursor: string | null) => Promise<CursorPage<T>>
) {
  const [state, setState] = useState<State<T>>(initial);
  const [attempt, setAttempt] = useState(0);

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

  const loadMore = useCallback(async () => {
    if (state.loading || !state.nextCursor) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const page = await fetchPage(state.nextCursor);
      setState((s) => ({
        items: [...s.items, ...page.items],
        nextCursor: page.nextCursor,
        initialized: true,
        loading: false,
        error: null,
      }));
    } catch (err) {
      setState((s) => ({ ...s, loading: false, error: getErrorMessage(err) }));
    }
  }, [fetchPage, state.loading, state.nextCursor]);

  const retry = useCallback(() => {
    if (state.initialized) {
      void loadMore();
      return;
    }
    setState(initial<T>());
    setAttempt((a) => a + 1);
  }, [state.initialized, loadMore]);

  const add = useCallback(
    (item: T) =>
      setState((s) => ({ ...s, items: [item, ...s.items.filter((i) => i.id !== item.id)] })),
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
  };
}