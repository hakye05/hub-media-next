"use client";

import { followsApi } from "@/lib/follows";
import { useState } from "react";

export function useFollow(
  username: string,
  initial: boolean,
  onChange?: (following: boolean) => void
) {
  const [following, setFollowing] = useState(initial);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (pending) return;
    const next = !following;
    setPending(true);
    setFollowing(next);
    onChange?.(next);
    try {
      await (next ? followsApi.follow(username) : followsApi.unfollow(username));
    } catch {
      setFollowing(!next);
      onChange?.(!next);
    } finally {
      setPending(false);
    }
  }

  return { following, pending, toggle };
}