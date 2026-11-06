"use client";

import { useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import CollectionList from "@/components/collections/CollectionList";
import { collectionsApi } from "@/lib/collections";

export default function ProfileCollections({ username }: { username: string }) {
  const { user } = useAuth();
  const isOwn = user?.username === username;

  const fetchPage = useCallback(
    (cursor: string | null) => collectionsApi.byUsername(username, cursor),
    [username]
  );

  return (
    <CollectionList
      key={`${username}:${user?.id ?? "guest"}`} // refetch when the viewer changes (private ones appear)
      username={username}
      fetchPage={fetchPage}
      canCreate={isOwn}
      emptyMessage={isOwn ? "You haven't created any collections yet." : "No collections yet."}
    />
  );
}