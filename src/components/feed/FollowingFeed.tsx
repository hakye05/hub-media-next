"use client";

import { useCallback } from "react";
import { postsApi } from "@/lib/posts";
import { useCursorList } from "@/lib/useCursorList";
import { useRequireAuth } from "@/components/auth/useRequireAuth";
import FeedPostCard from "./FeedPostCard";
import ListTail from "../ui/ListTail";

function Feed() {
  const fetchPage = useCallback((cursor: string | null) => postsApi.following(cursor), []);
  const { items, hasMore, loading, error, loadMore, retry } = useCursorList(fetchPage);

  return (
    <div className="mx-auto flex w-full max-w-124 flex-col gap-4 px-3 sm:gap-6 sm:px-6">
      {items.map((p) => (
        <FeedPostCard key={p.id} post={p} />
      ))}
      <ListTail
        loading={loading}
        error={error}
        retry={retry}
        showEmpty={items.length === 0}
        emptyMessage="Follow people to see their posts here."
        hasMore={hasMore}
        loadMore={loadMore}
      />
    </div>
  );
}

export default function FollowingFeed() {
  // Mount the feed only once the session is known, so the first request carries the token
  const user = useRequireAuth("/");
  if (!user) return null;
  return <Feed />;
}