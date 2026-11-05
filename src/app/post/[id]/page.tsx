import PostView from "@/components/posts/PostView";
import { Suspense } from "react";

export const instant = false;

async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PostView id={id} />;
}

export default function PostPage({ params }: PageProps<"/post/[id]">) {
  return (
    <Suspense fallback={null}>
      <Post params={params} />
    </Suspense>
  );
}