"use client";

import ListMessage from "./ListMessage";
import LoadMoreSentinel from "./LoadMoreSentinel";
import PostGrid from "./PostGrid";
import { usePostList, type FetchPage } from "./usePostList";

type Props = {
  fetchPage: FetchPage;
  includeCreated?: boolean;
  emptyMessage: string;
};

export default function PostList({ fetchPage, includeCreated = false, emptyMessage }: Props) {
  const { posts, loading, error, hasMore, loadMore, retry } = usePostList(
    fetchPage,
    includeCreated
  );

  return (
    <>
      {posts.length > 0 && <PostGrid posts={posts} />}

      {loading && <ListMessage>Loading…</ListMessage>}
      {error && (
        <ListMessage actionLabel="Try again" onAction={retry}>
          {error}
        </ListMessage>
      )}
      {!loading && !error && posts.length === 0 && <ListMessage>{emptyMessage}</ListMessage>}

      {hasMore && !loading && !error && <LoadMoreSentinel onVisible={loadMore} />}
    </>
  );
}