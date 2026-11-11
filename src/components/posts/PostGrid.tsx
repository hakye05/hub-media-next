import type { Post } from "@/lib/posts";
import MasonryGrid from "@/components/ui/masonry/MasonryGrid";
import PostCard from "./card/PostCard";

type Props = { posts: Post[]; onDeleted?: (id: string) => void };

const getId = (post: Post) => post.id;
const getRatio = (post: Post) =>
  post.width > 0 && post.height > 0 ? post.height / post.width : 1;

export default function PostGrid({ posts, onDeleted }: Props) {
  return (
    <MasonryGrid
      items={posts}
      getId={getId}
      getRatio={getRatio}
      renderItem={(post) => <PostCard post={post} onDeleted={onDeleted} />}
    />
  );
}