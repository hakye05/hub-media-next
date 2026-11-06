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
      <div className="group relative max-w-full overflow-hidden rounded-3xl bg-neutral-200/60">
        <img
          src={post.imageUrl}
          alt={post.title}
          width={post.width}
          height={post.height}
          decoding="async"
          className="block h-auto max-h-[64vh] w-auto max-w-full"
        />

        {/* Hidden until hover or keyboard focus; always visible on touch screens */}
        <div className="absolute right-4 top-4 opacity-0 drop-shadow-md transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
          <PostActions post={post} isAuthor={isAuthor} onEdit={onEdit} onDeleted={onDeleted} />
        </div>
      </div>
    </div>
  );
}