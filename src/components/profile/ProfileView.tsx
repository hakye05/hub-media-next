"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { ApiError } from "@/lib/api";
import { getErrorMessage } from "@/lib/errors";
import { usersApi, type PublicProfile, type UserMe } from "@/lib/users";
import { useAuth } from "../auth/AuthProvider";
import ProfileError from "./ProfileError";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { tabHref } from "./tabs";

type Result = {
  username: string;
  profile: PublicProfile | null;
  notFound: boolean;
  error: string | null;
};

type Props = { username: string; children: ReactNode };

export default function ProfileView({ username, children }: Props) {
  const router = useRouter();
  const segment = useSelectedLayoutSegment(); // null on /username, else "collections" | "saved"
  const { status, user } = useAuth();
  const [result, setResult] = useState<Result | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const viewerId = user?.id ?? null;

  // Wait for the session check so the request carries the token (isSelf / isFollowing),
  // and re-fetch if the viewer logs in or out, or after the profile is edited.
  useEffect(() => {
    if (status === "loading") return;
    let active = true;
    usersApi
      .getProfile(username)
      .then((profile) => {
        if (active) setResult({ username, profile, notFound: false, error: null });
      })
      .catch((err) => {
        if (!active) return;
        const notFound = err instanceof ApiError && err.status === 404;
        setResult({
          username,
          profile: null,
          notFound,
          error: notFound ? null : getErrorMessage(err),
        });
      });
    return () => {
      active = false;
    };
  }, [username, status, viewerId, reloadKey]);

  function handleUpdated(me: UserMe) {
    // Keep the current tab when the username changes
    if (me.username !== username) router.replace(tabHref(me.username, segment));
    else setReloadKey((k) => k + 1);
  }

  // Blank until we know who is looking
  if (status === "loading" || !result || result.username !== username) return null;

  if (!result.profile) {
    return result.notFound ? (
      <ProfileError title="User not found" message={`We couldn't find @${username}.`} />
    ) : (
      <ProfileError
        title="Something went wrong"
        message={result.error ?? "Please try again."}
      />
    );
  }

  return (
    <main className="flex flex-col gap-10 pb-16">
      <ProfileHeader profile={result.profile} />
      <ProfileContent
        isSelf={result.profile.isSelf}
        username={result.profile.username}
        activeSegment={segment}
        onProfileUpdated={handleUpdated}
      >
        {children}
      </ProfileContent>
    </main>
  );
}