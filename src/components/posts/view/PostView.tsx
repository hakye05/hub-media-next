"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { postsApi, type PostDetail } from "@/lib/posts";
import { useAuth } from "@/components/auth/AuthProvider";
import { useApiResource } from "@/lib/useApiResource";
import PageMessage from "@/components/ui/PageMessage";
import ProfilePosts from "@/components/profile/posts/ProfilePosts";
import EditPostModal from "./EditPostModal";
import PostImage from "./PostImage";
import PostInfo from "./PostInfo";

export default function PostView({ id }: { id: string }) {
  const { status, user } = useAuth();
  const router = useRouter();
  const viewerId = user?.id ?? null;
  const [editing, setEditing] = useState(false);
  const closeEditor = useCallback(() => setEditing(false), []);

  // Wait for the session check so the request carries the token, and refetch
  // when the viewer logs in or out.
  const { resource, reload } = useApiResource(id, () => postsApi.get(id), {
    enabled: status !== "loading",
    refreshKey: viewerId,
  });

  if (resource.status === "loading") return null;

  if (resource.status !== "ready") {
    return resource.status === "notFound" ? (
      <PageMessage title="Post not found" message="This post doesn't exist or was removed." />
    ) : (
      <PageMessage title="Something went wrong" message={resource.message} />
    );
  }

  const post: PostDetail = resource.data;
  const isAuthor = user?.username === post.author.username;

  function handleDeleted() {
    router.replace(`/${post.author.username}`);
    router.refresh();
  }

  return (
    <>
      <main className="mx-auto flex w-full max-w-6xl flex-col items-center px-3 pb-6 sm:px-9 sm:pb-10">
        <div className="flex w-fit max-w-full flex-col gap-5 sm:gap-8">
          <PostImage
            post={post}
            isAuthor={isAuthor}
            onEdit={() => setEditing(true)}
            onDeleted={handleDeleted}
          />
          <PostInfo
            post={post}
            isAuthor={isAuthor}
            onEdit={() => setEditing(true)}
            onDeleted={handleDeleted}
          />
        </div>
      </main>

      <section className="w-full border-t border-neutral-200 px-3 pb-12 pt-4 -mt-2 sm:px-9 sm:pb-16">
        <h2 className="mb-4 text-lg font-semibold tracking-tight">
          More from {post.author.username}
        </h2>
        <ProfilePosts username={post.author.username} />
      </section>

      {editing && <EditPostModal post={post} onClose={closeEditor} onSaved={reload} />}
    </>
  );
}