"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import CollectionList from "@/components/collections/CollectionList";
import { collectionsApi } from "@/lib/collections";

const fetchSaved = (cursor: string | null) => collectionsApi.saved(cursor);

export default function SavedCollections() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <section className="mt-14">
      <h2 className="mb-6 text-[22px] font-semibold tracking-tight">Saved Collections</h2>
      <CollectionList
        key={user.id}
        fetchPage={fetchSaved}
        canCreate={false}
        emptyMessage="Collections you save will show up here."
      />
    </section>
  );
}