"use client";

import { useCallback, useMemo, useState } from "react";
import PostList from "@/components/posts/PostList";
import SearchInput from "@/components/ui/SearchInput";
import { collectionsApi } from "@/lib/collections";
import type { Post } from "@/lib/posts";

export default function CollectionPosts({ collectionId }: { collectionId: string }) {
  const [query, setQuery] = useState("");

  const fetchPage = useCallback(
    (cursor: string | null) => collectionsApi.posts(collectionId, cursor),
    [collectionId]
  );

  // The API has no in-collection search, so this filters the pages already loaded
  const filter = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return undefined;
    return (p: Post) =>
      p.title.toLowerCase().includes(q) || (p.description ?? "").toLowerCase().includes(q);
  }, [query]);

  return (
    <>
      <SearchInput value={query} onChange={setQuery} placeholder="Search this collection" />
      <div className="w-full">
        <PostList
          key={collectionId}
          fetchPage={fetchPage}
          filter={filter}
          emptyMessage="No posts in this collection yet."
          noMatchMessage="No posts match your search."
        />
      </div>
    </>
  );
}