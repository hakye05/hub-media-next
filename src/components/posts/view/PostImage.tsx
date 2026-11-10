import type { PostDetail } from "@/lib/posts";
import PostActions from "./PostActions";

type Props = {
  post: PostDetail;
  isAuthor: boolean;
  onEdit: () => void;
  onDeleted: () => void;
};

export default function PostImage({ post, isAuthor, onEdit, onDeleted }: Props) {
  return (
    <div className="w-fit">
      <div className="group relative max-w-full overflow-hidden rounded-2xl bg-neutral-200/60 sm:rounded-3xl">
        <img
          src={post.imageUrl}
          alt={post.title}
          width={post.width}
          height={post.height}
          decoding="async"
          className="block h-auto max-h-[70vh] sm:max-h-[64vh] w-auto max-w-full"
        />

        {/* Desktop only: hidden until hover or keyboard focus; always visible on touch screens */}
        <div className="absolute right-3 top-3 hidden sm:right-4 sm:top-4 sm:block opacity-0 drop-shadow-md transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
          <PostActions post={post} isAuthor={isAuthor} onEdit={onEdit} onDeleted={onDeleted} />
        </div>
      </div>
    </div>
  );
}