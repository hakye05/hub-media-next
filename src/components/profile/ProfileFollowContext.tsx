"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { PublicProfile } from "@/lib/users";

type Value = {
  followers: number;
  isFollowing: boolean;
  onFollowChange: (following: boolean) => void;
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

  const onFollowChange = useCallback(
    (following: boolean) => setFollowers((c) => Math.max(0, c + (following ? 1 : -1))),
    []
  );

  return (
    <Ctx.Provider value={{ followers, isFollowing: profile.isFollowing, onFollowChange }}>
      {children}
    </Ctx.Provider>
  );
}

export function useProfileFollow() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useProfileFollow must be used inside ProfileFollowProvider");
  return v;
}