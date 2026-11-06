"use client";

import { useState } from "react";
import ListMessage from "@/components/posts/ListMessage";
import LoadMoreSentinel from "@/components/posts/LoadMoreSentinel";
import { useCursorList } from "@/components/ui/useCursorList";
import type { CollectionItem } from "@/lib/collections";
import type { CursorPage } from "@/lib/pagination";
import CollectionGrid from "./CollectionGrid";
import CreateCollectionModal from "./create/CreateCollectionModal";
import CreateCollectionCard from "./create/CreateCollectionCard";

type Props = {
  fetchPage: (cursor: string | null) => Promise<CursorPage<CollectionItem>>;
  canCreate: boolean;
  emptyMessage: string;
  /** Profile lists pass the owner; search results carry the owner on each item instead */
  username?: string;
};

export default function CollectionList({ fetchPage, canCreate, emptyMessage, username }: Props) {
  const { items, loading, error, hasMore, loadMore, retry, add } = useCursorList(fetchPage);
  const [creating, setCreating] = useState(false);

  return (
    <>
      {(canCreate || items.length > 0) && (
        <CollectionGrid
          collections={items}
          username={username}
          leading={canCreate && <CreateCollectionCard onClick={() => setCreating(true)} />}
        />
      )}

      {loading && <ListMessage>Loading…</ListMessage>}
      {error && (
        <ListMessage actionLabel="Try again" onAction={retry}>
          {error}
        </ListMessage>
      )}
      {!loading && !error && items.length === 0 && !canCreate && (
        <ListMessage>{emptyMessage}</ListMessage>
      )}

      {hasMore && !loading && !error && <LoadMoreSentinel onVisible={loadMore} />}

      {creating && <CreateCollectionModal onClose={() => setCreating(false)} onCreated={add} />}
    </>
  );
}