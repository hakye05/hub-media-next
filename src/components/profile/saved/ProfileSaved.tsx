"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import PostList from "@/components/posts/PostList";
import { savedPostsApi } from "@/lib/savedPosts";

const fetchSaved = (cursor: string | null) => savedPostsApi.list(cursor);

export default function ProfileSaved({ username }: { username: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const isOwner = user?.username === username;

  useEffect(() => {
    if (!isOwner) router.replace(`/${username}`);
  }, [isOwner, username, router]);

  if (!isOwner || !user) return null;

  return (
    <PostList
      key={user.id}
      fetchPage={fetchSaved}
      hideUnsaved
      emptyMessage="Posts you save will show up here."
    />
  );
}