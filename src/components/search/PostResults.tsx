"use client";

import { useCallback } from "react";
import PostList from "@/components/posts/PostList";
import { postsApi } from "@/lib/posts";

type Props = { q: string; color: string | null };

export default function PostResults({ q, color }: Props) {
  const fetchPage = useCallback(
    (cursor: string | null) => postsApi.search({ q, color }, cursor),
    [q, color]
  );
  const label = [q && `“${q}”`, color].filter(Boolean).join(" in ");

  return (
    <PostList fetchPage={fetchPage} emptyMessage={`No posts found for ${label}.`} />
  );
}