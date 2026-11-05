"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { postsApi, type Post, type PostDetail } from "@/lib/posts";
import { useAuth } from "../auth/AuthProvider";
import PageMessage from "../ui/PageMessage";
import EditPostModal from "./EditPostModal";
import PostImage from "./PostImage";
import PostInfo from "./PostInfo";
import ProfilePosts from "../profile/posts/ProfilePosts";

type Result = {
  id: string;
  post: PostDetail | null;
  notFound: boolean;
  error: string | null;
};

export default function PostView({ id }: { id: string }) {
  const { status, user } = useAuth();
  const [result, setResult] = useState<Result | null>(null);
  const [editing, setEditing] = useState(false);
  const closeEditor = useCallback(() => setEditing(false), []);
  const viewerId = user?.id ?? null;

  useEffect(() => {
    if (status === "loading") return;
    let active = true;
    postsApi
      .get(id)
      .then((post) => {
        if (active) setResult({ id, post, notFound: false, error: null });
      })
      .catch((err) => {
        if (!active) return;
        const notFound = err instanceof ApiError && err.status === 404;
        setResult({
          id,
          post: null,
          notFound,
          error: notFound ? null : getErrorMessage(err),
        });
      });
    return () => {
      active = false;
    };
  }, [id, status, viewerId]);

  function handleEdited(updated: Post) {
    setResult((r) =>
      r?.post
        ? {
            ...r,
            post: {
              ...r.post,
              title: updated.title,
              description: updated.description,
              updatedAt: updated.updatedAt,
            },
          }
        : r
    );
  }

  if (status === "loading" || !result || result.id !== id) return null;

  if (!result.post) {
    return result.notFound ? (
      <PageMessage title="Post not found" message="This post doesn't exist or was removed." />
    ) : (
      <PageMessage title="Something went wrong" message={result.error ?? "Please try again."} />
    );
  }

  const { post } = result;
  const isAuthor = user?.username === post.author.username;

  return (
    <>
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center px-9 pb-10">
        <div className="flex w-fit flex-col gap-8">
          <PostImage post={post} isAuthor={isAuthor} onEdit={() => setEditing(true)} />
          <PostInfo post={post} />
        </div>
      </main>

      <section className="w-full border-t border-neutral-200 px-9 pb-16 pt-4 -mt-2">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">
          More from {post.author.username}
        </h2>
        <ProfilePosts username={post.author.username} />
      </section>

      {editing && <EditPostModal post={post} onClose={closeEditor} onSaved={handleEdited} />}
    </>
  );
}