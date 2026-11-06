"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { postsApi } from "@/lib/posts";
import { useCursorList } from "@/lib/useCursorList";
import { useAuth } from "@/components/auth/AuthProvider";
import LoadMoreSentinel from "@/components/ui/LoadMoreSentinel";
import FeedPostCard from "./FeedPostCard";

function Feed() {
  const { items, hasMore, loading, error, loadMore } = useCursorList((c) => postsApi.following(c));

  return (
    <div className="mx-auto flex w-full max-w-124 flex-col gap-6 px-6">
      {items.map((p) => (
        <FeedPostCard key={p.id} post={p} />
      ))}
      {!loading && !error && items.length === 0 && (
        <p className="py-16 text-center text-[15px] text-neutral-500">
          Follow people to see their posts here.
        </p>
      )}
      {error && <p className="text-center text-[14px] text-red-600">{error}</p>}
      <LoadMoreSentinel onVisible={loadMore} disabled={!hasMore || loading} />
    </div>
  );
}

export default function FollowingFeed() {
  const { status, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !user) router.replace("/");
  }, [status, user, router]);

  // Mount the feed only once the session is known, so the first request carries the token
  if (status === "loading" || !user) return null;
  return <Feed />;
}