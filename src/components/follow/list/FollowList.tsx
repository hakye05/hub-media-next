"use client";

import { followsApi } from "@/lib/follows";
import { useCursorList } from "@/lib/useCursorList";
import LoadMoreSentinel from "@/components/ui/LoadMoreSentinel";
import FollowUserRow from "./FollowUserRow";
import { useCallback } from "react";

export type FollowKind = "followers" | "following";

type Props = {
  username: string;
  kind: FollowKind;
  query: string;
  onFollowChange?: (following: boolean) => void;
};

export default function FollowList({ username, kind, query, onFollowChange }: Props) {
  const fetchPage = useCallback(
    (cursor: string | null) =>
      kind === "followers"
        ? followsApi.followers(username, cursor, 20, query)
        : followsApi.following(username, cursor, 20, query),
    [username, kind, query]
  );
  const { items, hasMore, loading, error, loadMore } = useCursorList(fetchPage);

  return (
    <>
      <ul className="flex flex-col">
        {items.map((u) => (
          <FollowUserRow key={u.id} user={u} onFollowChange={onFollowChange} />
        ))}
      </ul>
      {!loading && !error && items.length === 0 && (
        <p className="py-8 text-center text-[14px] text-neutral-400">
          {query ? "No matches" : kind === "followers" ? "No followers yet" : "Not following anyone yet"}
        </p>
      )}
      {error && <p className="py-4 text-center text-[14px] text-red-600">{error}</p>}
      <LoadMoreSentinel onVisible={loadMore} disabled={!hasMore || loading} />
    </>
  );
}