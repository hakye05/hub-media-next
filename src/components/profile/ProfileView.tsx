"use client";

import type { ReactNode } from "react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { usersApi, type UserMe } from "@/lib/users";
import { useAuth } from "../auth/AuthProvider";
import { useApiResource } from "@/lib/useApiResource";
import ProfileError from "./ProfileError";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { tabHref } from "./tabs";
import { ProfileFollowProvider } from "./ProfileFollowContext";

type Props = { username: string; children: ReactNode };

export default function ProfileView({ username, children }: Props) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment(); // null on /username, else "collections" | "saved"
  const { status, user } = useAuth();
  const viewerId = user?.id ?? null;

  // Wait for the session check so the request carries the token (isSelf / isFollowing),
  // and re-fetch if the viewer logs in or out, or after the profile is edited.
  const { resource, reload } = useApiResource(username, () => usersApi.getProfile(username), {
    enabled: status !== "loading",
    refreshKey: viewerId,
  });

  function handleUpdated(me: UserMe) {
    // Keep the current tab when the username changes
    if (me.username !== username) router.replace(tabHref(me.username, segment));
    else reload();
  }

  // Blank until we know who is looking
  if (resource.status === "loading") return null;

  if (resource.status !== "ready") {
    return resource.status === "notFound" ? (
      <ProfileError title="User not found" message={`We couldn't find @${username}.`} />
    ) : (
      <ProfileError title="Something went wrong" message={resource.message} />
    );
  }

  const profile = resource.data;

  return (
    <ProfileFollowProvider key={profile.id} profile={profile}>
      <main className="flex flex-col pb-6">
        <ProfileHeader profile={profile} onBannerChanged={reload} />
        <ProfileContent
          isSelf={profile.isSelf}
          username={profile.username}
          activeSegment={segment}
          onProfileUpdated={handleUpdated}
        >
          {children}
        </ProfileContent>
      </main>
    </ProfileFollowProvider>
  );
}