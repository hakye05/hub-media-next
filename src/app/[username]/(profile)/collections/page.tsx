import ProfileCollections from "@/components/profile/collections/ProfileCollections";
import { Suspense } from "react";

export const instant = false;

async function Collections({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <ProfileCollections username={username} />;
}

export default function CollectionsPage({ params }: PageProps<"/[username]/collections">) {
  return (
    <Suspense fallback={null}>
      <Collections params={params} />
    </Suspense>
  );
}