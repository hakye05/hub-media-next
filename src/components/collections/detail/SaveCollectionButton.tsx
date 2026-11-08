"use client";

import BookmarkIcon from "@/components/icons/BookmarkIcon";
import { IconToolbarButton } from "@/components/ui/Button";
import { useSaveCollection } from "../useSaveCollection";
import LabeledAction from "./LabeledAction";

type Props = { collectionId: string; initialSaved: boolean };

export default function SaveCollectionButton({ collectionId, initialSaved }: Props) {
  const { saved, pending, toggle } = useSaveCollection(collectionId, initialSaved);

  return (
    <LabeledAction label={saved ? "Saved" : "Save"}>
      <IconToolbarButton
        label={saved ? "Unsave collection" : "Save collection"}
        onClick={toggle}
        disabled={pending}
        aria-pressed={saved}
      >
        <BookmarkIcon filled={saved} />
      </IconToolbarButton>
    </LabeledAction>
  );
}