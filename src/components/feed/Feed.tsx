import { postsApi } from "@/lib/posts";
import PostList from "../posts/PostList";

const fetchFeed = (cursor: string | null) => postsApi.feed(cursor);

export default function Feed() {
  return (
    <main className="flex-1 px-3 pb-5 sm:px-9">
      <PostList
        fetchPage={fetchFeed}
        includeCreated
        emptyMessage="No posts yet. Create the first one!"
      />
    </main>
  );
}