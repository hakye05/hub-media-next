"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { PublicProfile } from "@/lib/users";

type Value = {
  followers: number;
  following: number;
  isFollowing: boolean;
  onFollowChange: (following: boolean) => void;
  onFollowingDelta: (delta: 1 | -1) => void;
};

const Ctx = createContext<Value | null>(null);

export function ProfileFollowProvider({
  profile,
  children,
}: {
  profile: PublicProfile;
  children: ReactNode;
}) {
  const [followers, setFollowers] = useState(profile.followerCount);
  const [following, setFollowing] = useState(profile.followingCount);

  const onFollowChange = useCallback(
    (isFollowing: boolean) => setFollowers((c) => Math.max(0, c + (isFollowing ? 1 : -1))),
    []
  );

  const onFollowingDelta = useCallback(
    (delta: 1 | -1) => setFollowing((c) => Math.max(0, c + delta)),
    []
  );

  return (
    <Ctx.Provider
      value={{
        followers,
        following,
        isFollowing: profile.isFollowing,
        onFollowChange,
        onFollowingDelta,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useProfileFollow() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useProfileFollow must be used inside ProfileFollowProvider");
  return v;
}