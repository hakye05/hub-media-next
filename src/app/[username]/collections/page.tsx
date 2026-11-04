import { Suspense } from "react";

type Params = Promise<{ username: string }>;

async function Profile({ params }: { params: Params }) {
  const { username } = await params;
  // return <ProfileView username={username} />;
}

export default function CollectionsPage({ params }: { params: Params }) {
  return (
    <>
      <Suspense fallback={null}>
        {/* <Profile params={params} /> */}
      </Suspense>
    </>
  );
}