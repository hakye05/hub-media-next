"use client";

import type { Post } from "@/lib/posts";
import PostCardMenu from "./PostCardMenu";
import SavePostButton from "../buttons/SavePostButton";
import { useAuth } from "@/components/auth/AuthProvider";

type Props = { post: Post; onDeleted: (id: string) => void };

// Hidden until hover or keyboard focus; always visible on touch screens
const REVEAL =
  "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100";

export default function PostCardActions({ post, onDeleted }: Props) {
  const { user } = useAuth();
  const isAuthor = user?.id === post.userId;

  return (
    <>
      <div className={`absolute right-3 top-3 ${REVEAL}`}>
        <SavePostButton variant="text" postId={post.id} saved={post.savedByViewer} />
      </div>

      {/* Stays visible while its menu is open */}
      <div
        className={`absolute bottom-3 right-3 has-aria-expanded:opacity-100 ${REVEAL}`}
      >
        <PostCardMenu post={post} isAuthor={isAuthor} onDeleted={onDeleted} />
      </div>
    </>
  );
}