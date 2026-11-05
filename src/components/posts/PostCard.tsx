import type { Post } from "@/lib/posts";

export default function PostCard({ post }: { post: Post }) {
  return (
    <figure className="group relative overflow-hidden rounded-2xl bg-neutral-200/60">
      {/* width/height reserve the space, so the masonry doesn't jump while images load */}
      <img
        src={post.imageUrl}
        alt={post.title}
        width={post.width}
        height={post.height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/60 to-transparent px-4 pb-3 pt-8 text-[14px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
        {post.title}
      </figcaption>
    </figure>
  );
}