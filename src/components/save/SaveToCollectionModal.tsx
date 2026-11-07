"use client";

import { useState } from "react";
import BookmarkIcon from "@/components/icons/BookmarkIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import Modal from "@/components/ui/Modal";
import StatusText from "@/components/ui/StatusText";
import CollectionThumb from "../collections/CollectionThumb";
import { collectionSubtitle } from "../collections/format";
import CreateCollectionModal from "../collections/create/CreateCollectionModal";
import PickerRow from "./PickerRow";
import { SAVED_KEY, useCollectionPicker } from "./useCollectionPicker";

const noop = () => {};

type Props = { postId: string; wasSaved: boolean; username: string; onClose: () => void };

export default function SaveToCollectionModal({ postId, wasSaved, username, onClose }: Props) {
  const [creating, setCreating] = useState(false);
  const picker = useCollectionPicker({ postId, username, wasSaved });

  return (
    <>
      {/* While the create modal is open, Escape/backdrop only close that one */}
      <Modal label="Save post" onClose={creating ? noop : onClose} className="max-w-95">
        <div className="flex max-h-[80vh] flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto p-3">
            <PickerRow
              thumb={
                <CollectionThumb className="h-12 w-12 bg-linear-to-br from-rose-200 via-fuchsia-200 to-purple-300 text-neutral-800">
                  <BookmarkIcon filled />
                </CollectionThumb>
              }
              title="Saved"
              subtitle="Private"
              selected={picker.saved}
              disabled={picker.busy.has(SAVED_KEY)}
              onClick={picker.toggleSaved}
            />

            {picker.collections.map((c) => (
              <PickerRow
                key={c.id}
                thumb={<CollectionThumb url={c.coverImageUrl} />}
                title={c.title}
                subtitle={collectionSubtitle(c)}
                selected={picker.memberOf.has(c.id)}
                disabled={picker.busy.has(c.id)}
                onClick={() => picker.toggleCollection(c.id)}
              />
            ))}

            {picker.loading && (
              <p className="px-3 py-4 text-center text-[14px] text-neutral-400">Loading…</p>
            )}
          </div>

          {picker.error && (
            <div className="px-5 pb-2">
              <StatusText status={{ type: "error", text: picker.error }} />
              {picker.collections.length === 0 && !picker.loading && (
                <button
                  type="button"
                  onClick={picker.retry}
                  className="px-1 text-[13px] font-semibold hover:underline"
                >
                  Try again
                </button>
              )}
            </div>
          )}

          <div className="border-t border-neutral-200 p-3">
            <PickerRow
              thumb={
                <CollectionThumb className="h-12 w-12 bg-neutral-100 text-neutral-500">
                  <PlusIcon size={22} />
                </CollectionThumb>
              }
              title="Create collection"
              subtitle="Organize your posts"
              onClick={() => setCreating(true)}
            />
          </div>
        </div>
      </Modal>

      {creating && (
        <CreateCollectionModal
          onClose={() => setCreating(false)}
          onCreated={picker.addCreated}
        />
      )}
    </>
  );
}