import type { Post } from "@/lib/posts";
import PostCard from "./card/PostCard";

type Props = { posts: Post[]; onDeleted?: (id: string) => void };

export default function PostGrid({ posts, onDeleted }: Props) {
  return (
    <div className="columns-2 gap-5 sm:columns-3 md:columns-4 lg:columns-5">
      {posts.map((post) => (
        <div key={post.id} className="mb-5 break-inside-avoid">
          <PostCard post={post} onDeleted={onDeleted} />
        </div>
      ))}
    </div>
  );
}