"use client";

import type { Post } from "@/lib/posts";
import { useAuth } from "../../auth/AuthProvider";
import PostCardMenu from "./PostCardMenu";
import SavePostButton from "../buttons/SavePostButton";

type Props = { post: Post; onDeleted: (id: string) => void };

export default function PostCardActions({ post, onDeleted }: Props) {
  const { user } = useAuth();
  const isAuthor = user?.id === post.userId;

  return (
    <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 has-[[aria-expanded=true]]:opacity-100 [@media(hover:none)]:opacity-100">
      <SavePostButton saved={post.savedByViewer} size="sm" />
      <PostCardMenu post={post} isAuthor={isAuthor} onDeleted={onDeleted} />
    </div>
  );
}