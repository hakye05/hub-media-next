"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LockIcon from "@/components/icons/LockIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import Avatar from "@/components/ui/Avatar";
import { IconToolbarButton } from "@/components/ui/Button";
import CopyLinkButton from "@/components/ui/CopyLinkButton";
import type { CollectionDetail } from "@/lib/collections";
import DeleteCollectionDialog from "./DeleteCollectionDialog";
import LabeledAction from "./LabeledAction";
import SaveCollectionButton from "./SaveCollectionButton";

type Props = { collection: CollectionDetail; isOwner: boolean };

export default function CollectionHeader({ collection, isOwner }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const { author } = collection;

  function handleDeleted() {
    router.replace(`/${author.username}/collections`);
    router.refresh();
  }

  return (
    <header className="flex flex-col items-center gap-4 text-center">
      <h1 className="max-w-3xl wrap-break-word text-4xl font-bold tracking-tight">
        {collection.title}
      </h1>

      <p className="flex items-center gap-1.5 text-[15px] font-semibold text-neutral-400">
        <Link href={`/${author.username}`} className="hover:text-neutral-900">
          @{author.username}
        </Link>
        <span aria-hidden>·</span>
        {collection.isPublic ? (
          "Public"
        ) : (
          <span className="flex items-center gap-1">
            Private <LockIcon size={15} />
          </span>
        )}
      </p>

      <Link href={`/${author.username}`} aria-label={`${author.displayName}'s profile`}>
        <Avatar
          name={author.displayName}
          src={author.avatarUrl}
          className="h-10 w-10"
          textClassName="text-[14px]"
        />
      </Link>

      <div className="mt-2 flex items-start justify-center gap-4">
        {!isOwner && (
          <SaveCollectionButton
            key={`${collection.id}:${collection.savedByViewer}`}
            collectionId={collection.id}
            initialSaved={collection.savedByViewer}
          />
        )}
        
        <LabeledAction label="Copy link">
          <CopyLinkButton path={`/${author.username}/collection/${collection.id}`} />
        </LabeledAction>

        {isOwner && (
          <LabeledAction label="Delete">
            <IconToolbarButton label="Delete collection" onClick={() => setConfirming(true)}>
              <TrashIcon />
            </IconToolbarButton>
          </LabeledAction>
        )}
      </div>

      {confirming && (
        <DeleteCollectionDialog
          collectionId={collection.id}
          onDeleted={handleDeleted}
          onClose={() => setConfirming(false)}
        />
      )}
    </header>
  );
}