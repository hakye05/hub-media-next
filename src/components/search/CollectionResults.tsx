"use client";

import { useCallback } from "react";
import CollectionList from "@/components/collections/CollectionList";
import { collectionsApi } from "@/lib/collections";

export default function CollectionResults({ q }: { q: string }) {
  const fetchPage = useCallback(
    (cursor: string | null) => collectionsApi.search(q, cursor),
    [q]
  );

  return (
    <CollectionList
      fetchPage={fetchPage}
      canCreate={false}
      emptyMessage={`No collections found for “${q}”.`}
    />
  );
}