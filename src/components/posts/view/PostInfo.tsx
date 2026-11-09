import type { PostDetail } from "@/lib/posts";
import PostAuthor from "../PostAuthor";
import SavePostButton from "../buttons/SavePostButton";
import PostMobileMenu from "./PostMobileMenu";

const dateFormat = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

type Props = {
  post: PostDetail;
  isAuthor: boolean;
  onEdit: () => void;
  onDeleted: () => void;
};

export default function PostInfo({ post, isAuthor, onEdit, onDeleted }: Props) {
  const edited = post.updatedAt !== post.createdAt;

  return (
    <section className="flex w-full flex-col gap-4 sm:gap-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <PostAuthor author={post.author} />
        </div>

        {/* Phones only: bookmark + more menu (desktop uses the image overlay) */}
        <div className="flex shrink-0 items-center gap-2 sm:hidden">
          <SavePostButton postId={post.id} saved={post.savedByViewer} />
          <PostMobileMenu post={post} isAuthor={isAuthor} onEdit={onEdit} onDeleted={onDeleted} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="wrap-break-word text-xl font-bold sm:text-2xl tracking-tight">{post.title}</h1>
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