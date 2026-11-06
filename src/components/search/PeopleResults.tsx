"use client";

import FollowUserRow from "@/components/follow/list/FollowUserRow";
import LoadMoreSentinel from "@/components/ui/LoadMoreSentinel";
import { usersApi } from "@/lib/users";
import { useCursorList } from "@/lib/useCursorList";

export default function PeopleResults({ q }: { q: string }) {
  const { items, hasMore, loading, error, loadMore } = useCursorList((cursor) =>
    usersApi.search(q, cursor)
  );

  return (
    <div className="mx-auto -mt-2 max-w-2xl">
      <ul className="flex flex-col">
        {items.map((u) => (
          <FollowUserRow key={u.id} user={u} />
        ))}
      </ul>
      {!loading && !error && items.length === 0 && (
        <p className="py-8 text-center text-[15px] text-neutral-500">No people found for “{q}”.</p>
      )}
      {error && <p className="py-4 text-center text-[14px] text-red-600">{error}</p>}
      <LoadMoreSentinel onVisible={loadMore} disabled={!hasMore || loading} />
    </div>
  );
}