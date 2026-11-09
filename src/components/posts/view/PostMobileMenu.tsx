"use client";

import { useCallback, useState } from "react";
import { downloadImage } from "@/lib/downloadImage";
import type { PostDetail } from "@/lib/posts";
import BookmarkIcon from "@/components/icons/BookmarkIcon";
import DotsIcon from "@/components/icons/DotsIcon";
import DownloadIcon from "@/components/icons/DownloadIcon";
import LinkIcon from "@/components/icons/LinkIcon";
import PencilIcon from "@/components/icons/PencilIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import { useSavePost } from "@/components/save/savePostContext";
import { IconToolbarButton } from "@/components/ui/Button";
import MenuItem from "@/components/ui/menu/MenuItem";
import PopoverMenu from "@/components/ui/menu/PopoverMenu";
import DeletePostDialog from "../DeletePostDialog";

type Props = {
  post: PostDetail;
  isAuthor: boolean;
  onEdit: () => void;
  onDeleted: () => void;
};

/** Phone-only "more" menu on the post view: save, copy, download, edit, delete. */
export default function PostMobileMenu({ post, isAuthor, onEdit, onDeleted }: Props) {
  const { isSaved, openSave } = useSavePost();
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const savedNow = isSaved(post.id, post.savedByViewer);

  const closeMenu = useCallback(() => {
    setAnchor(null);
    setCopied(false);
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
      setCopied(true);
      setTimeout(closeMenu, 800);
    } catch {
      closeMenu();
    }
  }

  return (
    <>
      <IconToolbarButton
        label="More actions"
        aria-haspopup="menu"
        aria-expanded={anchor !== null}
        onClick={(e) => setAnchor(e.currentTarget.getBoundingClientRect())}
      >
        <DotsIcon />
      </IconToolbarButton>

      {anchor && (
        <PopoverMenu anchor={anchor} onClose={closeMenu}>
          <MenuItem label={copied ? "Copied!" : "Copy link"} icon={<LinkIcon />} onClick={copyLink} />
          <MenuItem
            label="Download"
            icon={<DownloadIcon />}
            onClick={() => {
              closeMenu();
              downloadImage(post.imageUrl, post.title).catch(() => {});
            }}
          />
          {isAuthor && (
            <>
              <MenuItem
                label="Edit"
                icon={<PencilIcon />}
                onClick={() => {
                  closeMenu();
                  onEdit();
                }}
              />
              <MenuItem
                label="Delete"
                tone="danger"
                icon={<TrashIcon />}
                onClick={() => {
                  closeMenu();
                  setDeleting(true);
                }}
              />
            </>
          )}
        </PopoverMenu>
      )}

      {deleting && (
        <DeletePostDialog
          postId={post.id}
          onDeleted={onDeleted}
          onClose={() => setDeleting(false)}
        />
      )}
    </>
  );
}