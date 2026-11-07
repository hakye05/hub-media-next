"use client";

import { useCallback, useMemo } from "react";
import type { CursorPage } from "@/lib/pagination";
import type { Post } from "@/lib/posts";
import { useCursorList } from "@/lib/useCursorList";
import { useCreatedPosts } from "./CreatedPostsProvider";

export type FetchPage = (cursor: string | null) => Promise<CursorPage<Post>>;

/**
 * Cursor-paginated post list. `fetchPage` must be referentially stable
 * (module-level function or useCallback); a new one starts a fresh list.
 */
export function usePostList(fetchPage: FetchPage, includeCreated: boolean) {
  const { created, remove: removeCreated } = useCreatedPosts();
  const {
    items,
    loading,
    error,
    hasMore,
    loadMore,
    retry,
    remove: removeItem,
  } = useCursorList<Post>(fetchPage);

  const remove = useCallback(
    (id: string) => {
      removeItem(id);
      removeCreated(id);
    },
    [removeItem, removeCreated]
  );

  // Posts created in this session go on top, without duplicating fetched ones
  const posts = useMemo(() => {
    if (!includeCreated) return items;
    const known = new Set(items.map((p) => p.id));
    return [...created.filter((p) => !known.has(p.id)), ...items];
  }, [items, created, includeCreated]);

  return { posts, loading, error, hasMore, loadMore, retry, remove };
}