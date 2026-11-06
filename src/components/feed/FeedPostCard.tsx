import Link from "next/link";
import type { PostDetail } from "@/lib/posts";
import PostAuthor from "../posts/PostAuthor";
import FollowButton from "../follow/FollowButton";

export default function FeedPostCard({ post }: { post: PostDetail }) {
  return (
    <article className="flex flex-col gap-3 rounded-3xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <PostAuthor author={post.author} />
        </div>
        <FollowButton
          key={post.author.id}
          username={post.author.username}
          isFollowing={post.author.isFollowing}
        />
      </div>
      
      <div className="flex flex-col gap-1">
        <h2 className="wrap-break-word text-lg font-bold tracking-tight">{post.title}</h2>
        {post.description && (
          <p className="whitespace-pre-line wrap-break-word text-[15px] leading-relaxed text-neutral-800">
            {post.description}
          </p>
        )}
      </div>
      <Link href={`/post/${post.id}`} className="block overflow-hidden rounded-2xl bg-neutral-200/60">
        <img
          src={post.imageUrl}
          alt={post.title}
          width={post.width}
          height={post.height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </Link>
    </article>
  );
}