import type { ReactNode } from "react";
import type { CollectionItem } from "@/lib/collections";
import CollectionCard from "./CollectionCard";

type Props = { collections: CollectionItem[]; username?: string; leading?: ReactNode };

export default function CollectionGrid({ collections, username, leading }: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-8 sm:gap-y-8 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {leading}
      {collections.map((c) => (
        <CollectionCard key={c.id} collection={c} username={username} />
      ))}
    </div>
  );
}