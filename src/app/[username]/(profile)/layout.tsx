import ProfileView from "@/components/profile/ProfileView";
import { Suspense, type ReactNode } from "react";

type Params = Promise<{ username: string }>;

async function Profile({ params, children }: { params: Params; children: ReactNode }) {
  const { username } = await params;
  return <ProfileView username={username}>{children}</ProfileView>;
}

export default function ProfileLayout({ children, params }: LayoutProps<"/[username]">) {
  return (
    <Suspense fallback={null}>
      <Profile params={params}>{children}</Profile>
    </Suspense>
  );
}