"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PostList from "@/components/posts/PostList";
import SearchInput from "@/components/ui/SearchInput";
import { collectionsApi } from "@/lib/collections";
import type { Post } from "@/lib/posts";
import { useSavePost } from "@/components/save/savePostContext";

export default function CollectionPosts({ collectionId }: { collectionId: string }) {
  const [query, setQuery] = useState("");
  const { removedFrom, clearRemoved } = useSavePost()
  const removedIds = removedFrom(collectionId);

  const fetchPage = useCallback(
    (cursor: string | null) => collectionsApi.posts(collectionId, cursor),
    [collectionId]
  );

  const filter = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return undefined;
    return (p: Post) =>
      p.title.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q);
  }, [query]);


  useEffect(() => {
    clearRemoved(collectionId);   // Bug 2 fix: fresh mount = server is source of truth
  }, [collectionId, clearRemoved]);
  return (
    <>
      <SearchInput value={query} onChange={setQuery} placeholder="Search this collection" />
      <div className="w-full">
        <PostList
          key={collectionId}
          fetchPage={fetchPage}
          filter={filter}
          removedIds={removedIds}
          emptyMessage="No posts in this collection yet."
          noMatchMessage="No posts match your search."
        />
      </div>
    </>
  );
}