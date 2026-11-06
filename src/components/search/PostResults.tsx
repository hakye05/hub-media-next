"use client";

import { useCallback } from "react";
import PostList from "@/components/posts/PostList";
import { postsApi } from "@/lib/posts";

export default function PostResults({ q }: { q: string }) {
  const fetchPage = useCallback((cursor: string | null) => postsApi.search(q, cursor), [q]);

  return (
    <div className="-mt-2">
      <PostList fetchPage={fetchPage} emptyMessage={`No posts found for “${q}”.`} />
    </div>
  );
}