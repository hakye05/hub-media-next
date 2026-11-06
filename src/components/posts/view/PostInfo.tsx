import type { PostDetail } from "@/lib/posts";
import PostAuthor from "../PostAuthor";

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

export default function PostInfo({ post }: { post: PostDetail }) {
  const edited = post.updatedAt !== post.createdAt;

  return (
    <section className="flex w-full flex-col gap-5">
      <PostAuthor author={post.author} />

      <div className="flex flex-col gap-2">
        <h1 className="wrap-break-word text-2xl font-bold tracking-tight">{post.title}</h1>
        {post.description && (
          <p className="whitespace-pre-line wrap-break-word text-[15px] leading-relaxed text-neutral-800">
            {post.description}
          </p>
        )}
        <p className="text-[13px] text-neutral-400">
          {dateFormat.format(new Date(post.createdAt))}
          {edited && " · Edited"}
        </p>
      </div>
    </section>
  );
}