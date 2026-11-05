import type { Post } from "@/lib/posts";
import PostCard from "./PostCard";

export default function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="columns-2 gap-5 sm:columns-3 md:columns-4 lg:columns-5">
      {posts.map((post) => (
        <div key={post.id} className="mb-5 break-inside-avoid">
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}