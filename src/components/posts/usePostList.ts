import { useCallback, useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import type { CursorPage } from "@/lib/pagination";
import type { Post } from "@/lib/posts";
import { useCreatedPosts } from "./CreatedPostsProvider";

export type FetchPage = (cursor: string | null) => Promise<CursorPage<Post>>;

type State = {
  items: Post[];
  nextCursor: string | null;
  initialized: boolean;
  loading: boolean;
  error: string | null;
};

const INITIAL: State = {
  items: [],
  nextCursor: null,
  initialized: false,
  loading: true,
  error: null,
};

/**
 * Cursor-paginated post list. `fetchPage` must be referentially stable
 * (module-level function or useCallback); a new one starts a fresh list.
 */
export function usePostList(fetchPage: FetchPage, includeCreated: boolean) {
  const { created, remove: removeCreated } = useCreatedPosts();
  const [state, setState] = useState<State>(INITIAL);
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
    const cursor = state.nextCursor;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const page = await fetchPage(cursor);
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
    setState(INITIAL);
    setAttempt((a) => a + 1);
  }, [state.initialized, loadMore]);

  const remove = useCallback(
    (id: string) => {
      setState((s) => ({ ...s, items: s.items.filter((p) => p.id !== id) }));
      removeCreated(id);
    },
    [removeCreated]
  );

  // Posts created in this session go on top, without duplicating fetched ones
  const posts = useMemo(() => {
    if (!includeCreated) return state.items;
    const known = new Set(state.items.map((p) => p.id));
    return [...created.filter((p) => !known.has(p.id)), ...state.items];
  }, [state.items, created, includeCreated]);

  return {
    posts,
    loading: state.loading,
    error: state.error,
    hasMore: state.nextCursor !== null,
    loadMore,
    retry,
    remove,
  };
}