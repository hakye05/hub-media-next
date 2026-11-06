import ProfileSaved from "@/components/profile/saved/ProfileSaved";
import { Suspense } from "react";

export const instant = false;

async function Saved({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <ProfileSaved username={username} />;
}

export default function SavedPage({ params }: PageProps<"/[username]/saved">) {
  return (
    <Suspense fallback={null}>
      <Saved params={params} />
    </Suspense>
  );
}