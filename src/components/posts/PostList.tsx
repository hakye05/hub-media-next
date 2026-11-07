"use client";

import { useMemo } from "react";
import { useSavePost } from "../save/savePostContext";
import type { Post } from "@/lib/posts";
import ListTail from "@/components/ui/ListTail";
import PostGrid from "./PostGrid";
import { usePostList, type FetchPage } from "./usePostList";

type Props = {
  fetchPage: FetchPage;
  includeCreated?: boolean;
  emptyMessage: string;
  noMatchMessage?: string;
  filter?: (post: Post) => boolean;
  hideUnsaved?: boolean;
  removedIds?: ReadonlySet<string>;
};

export default function PostList({
  fetchPage,
  includeCreated = false,
  emptyMessage,
  noMatchMessage = "No posts match your search.",
  filter,
  hideUnsaved = false,
  removedIds,
}: Props) {
  const { posts, loading, error, hasMore, loadMore, retry, remove } = usePostList(
    fetchPage,
    includeCreated
  );
  const { isSaved } = useSavePost();

  const visible = useMemo(
    () =>
      posts.filter(
        (p) =>
          (!hideUnsaved || isSaved(p.id, true)) &&
          (!filter || filter(p)) &&
          !removedIds?.has(p.id)
      ),
    [posts, hideUnsaved, isSaved, filter, removedIds]
  );

  const filteredOut = Boolean(filter) && posts.length > 0;

  return (
    <>
      {visible.length > 0 && <PostGrid posts={visible} onDeleted={remove} />}

      <ListTail
        loading={loading}
        error={error}
        retry={retry}
        showEmpty={visible.length === 0}
        emptyMessage={filteredOut ? noMatchMessage : emptyMessage}
        hasMore={hasMore}
        loadMore={loadMore}
        rootMargin="600px"
      />
    </>
  );
}