import { postsApi } from "@/lib/posts";
import PostList from "../posts/PostList";

const fetchFeed = (cursor: string | null) => postsApi.feed(cursor);

export default function Feed() {
  return (
    <main className="flex-1 px-9 pb-5">
      <PostList
        fetchPage={fetchFeed}
        includeCreated
        emptyMessage="No posts yet. Create the first one!"
      />
    </main>
  );
}