"use client";

import { useCallback } from "react";
import { postsApi } from "@/lib/posts";
import { useAuth } from "../../auth/AuthProvider";
import PostList from "../../posts/PostList";

export default function ProfilePosts({ username }: { username: string }) {
  const { user } = useAuth();
  const isOwn = user?.username === username;

  const fetchPage = useCallback(
    (cursor: string | null) => postsApi.byUsername(username, cursor),
    [username]
  );

  return (
    <PostList
      key={username}
      fetchPage={fetchPage}
      includeCreated={isOwn}
      emptyMessage={isOwn ? "You haven't posted anything yet." : "No posts yet."}
    />
  );
}