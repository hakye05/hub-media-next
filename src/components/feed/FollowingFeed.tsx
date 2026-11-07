"use client";

import { useCallback } from "react";
import { postsApi } from "@/lib/posts";
import { useCursorList } from "@/lib/useCursorList";
import { useRequireAuth } from "@/components/auth/useRequireAuth";
import ListMessage from "@/components/posts/ListMessage";
import LoadMoreSentinel from "@/components/ui/LoadMoreSentinel";
import FeedPostCard from "./FeedPostCard";

function Feed() {
  const fetchPage = useCallback((cursor: string | null) => postsApi.following(cursor), []);
  const { items, hasMore, loading, error, loadMore, retry } = useCursorList(fetchPage);

  return (
    <div className="mx-auto flex w-full max-w-124 flex-col gap-6 px-6">
      {items.map((p) => (
        <FeedPostCard key={p.id} post={p} />
      ))}
      {!loading && !error && items.length === 0 && (
        <ListMessage>Follow people to see their posts here.</ListMessage>
      )}
      {error && (
        <ListMessage actionLabel="Try again" onAction={retry}>
          {error}
        </ListMessage>
      )}
      <LoadMoreSentinel onVisible={loadMore} disabled={!hasMore || loading} />
    </div>
  );
}

export default function FollowingFeed() {
  // Mount the feed only once the session is known, so the first request carries the token
  const user = useRequireAuth("/");
  if (!user) return null;
  return <Feed />;
}