import Link from "next/link";
import type { Post } from "@/lib/posts";
import PostCardActions from "./PostCardActions";

type Props = { post: Post; onDeleted?: (id: string) => void };

export default function PostCard({ post, onDeleted }: Props) {
  return (
    <figure className="group relative">
      <Link
        href={`/post/${post.id}`}
        className="relative block overflow-hidden rounded-2xl bg-neutral-200/60"
      >
        <img
          src={post.imageUrl}
          alt={post.title}
          width={post.width}
          height={post.height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/60 to-transparent py-3 pl-4 pr-24 pt-8 text-[14px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
          {post.title}
        </figcaption>
      </Link>
      <PostCardActions post={post} onDeleted={(id) => onDeleted?.(id)} />
    </figure>
  );
}