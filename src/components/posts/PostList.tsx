"use client";

import { useMemo } from "react";
import { useSavePost } from "../collections/save/savePostContext";
import type { Post } from "@/lib/posts";
import ListMessage from "./ListMessage";
import LoadMoreSentinel from "./LoadMoreSentinel";
import PostGrid from "./PostGrid";
import { usePostList, type FetchPage } from "./usePostList";

type Props = {
  fetchPage: FetchPage;
  includeCreated?: boolean;
  emptyMessage: string;
  noMatchMessage?: string;
  filter?: (post: Post) => boolean;
  hideUnsaved?: boolean;
};

export default function PostList({
  fetchPage,
  includeCreated = false,
  emptyMessage,
  noMatchMessage = "No posts match your search.",
  filter,
  hideUnsaved = false,
}: Props) {
  const { posts, loading, error, hasMore, loadMore, retry, remove } = usePostList(
    fetchPage,
    includeCreated
  );
  const { isSaved } = useSavePost();

  const visible = useMemo(
    () =>
      posts.filter(
        (p) => (!hideUnsaved || isSaved(p.id, true)) && (!filter || filter(p))
      ),
    [posts, hideUnsaved, isSaved, filter]
  );

  const filteredOut = Boolean(filter) && posts.length > 0;

  return (
    <>
      {visible.length > 0 && <PostGrid posts={visible} onDeleted={remove} />}

      {loading && <ListMessage>Loading…</ListMessage>}
      {error && (
        <ListMessage actionLabel="Try again" onAction={retry}>
          {error}
        </ListMessage>
      )}
      {!loading && !error && visible.length === 0 && (
        <ListMessage>{filteredOut ? noMatchMessage : emptyMessage}</ListMessage>
      )}

      {hasMore && !loading && !error && <LoadMoreSentinel onVisible={loadMore} />}
    </>
  );
}