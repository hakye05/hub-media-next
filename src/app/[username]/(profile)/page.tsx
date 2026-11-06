import ProfilePosts from "@/components/profile/posts/ProfilePosts";
import { Suspense } from "react";

export const instant = false;

async function Posts({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <ProfilePosts username={username} />;
}

export default function PostsPage({ params }: PageProps<"/[username]">) {
  return (
    <Suspense fallback={null}>
      <Posts params={params} />
    </Suspense>
  );
}