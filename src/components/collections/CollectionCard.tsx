import Link from "next/link";
import type { Collection } from "@/lib/collections";
import { collectionSubtitle } from "./format";

export default function CollectionCard({ collection,  username }: { collection: Collection, username: string }) {
  return (
    <Link href={`/${username}/collection/${collection.id}`} className="group block">
      <div className="aspect-square overflow-hidden rounded-2xl bg-neutral-200/60">
        {collection.coverImageUrl && (
          <img
            src={collection.coverImageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <p className="mt-2 truncate text-[15px] font-semibold text-neutral-900">{collection.title}</p>
      <p className="text-[13px] text-neutral-500">{collectionSubtitle(collection)}</p>
    </Link>
  );
}