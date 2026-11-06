"use client";

import { useCallback, useState } from "react";
import { downloadImage } from "@/lib/downloadImage";
import type { Post } from "@/lib/posts";
import DotsIcon from "../../icons/DotsIcon";
import DownloadIcon from "../../icons/DownloadIcon";
import LinkIcon from "../../icons/LinkIcon";
import TrashIcon from "../../icons/TrashIcon";
import { IconSolidButton } from "../../ui/Button";
import MenuItem from "../../ui/menu/MenuItem";
import PopoverMenu from "../../ui/menu/PopoverMenu";
import DeletePostDialog from "../DeletePostDialog";

type Props = {
  post: Post;
  isAuthor: boolean;
  onDeleted: (id: string) => void;
};

export default function PostCardMenu({ post, isAuthor, onDeleted }: Props) {
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

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

  function download() {
    closeMenu();
    downloadImage(post.imageUrl, post.title).catch(() => {});
  }

  function startDelete() {
    closeMenu();
    setDeleting(true);
  }

  return (
    <>
      <IconSolidButton
        label="More actions"
        size="sm"
        aria-haspopup="menu"
        aria-expanded={anchor !== null}
        onClick={(e) => setAnchor(e.currentTarget.getBoundingClientRect())}
      >
        <DotsIcon />
      </IconSolidButton>

      {anchor && (
        <PopoverMenu anchor={anchor} onClose={closeMenu}>
          <MenuItem label={copied ? "Copied!" : "Copy link"} icon={<LinkIcon />} onClick={copyLink} />
          <MenuItem label="Download" icon={<DownloadIcon />} onClick={download} />
          {isAuthor && (
            <MenuItem label="Delete" tone="danger" icon={<TrashIcon />} onClick={startDelete} />
          )}
        </PopoverMenu>
      )}

      {deleting && (
        <DeletePostDialog
          postId={post.id}
          onDeleted={() => onDeleted(post.id)}
          onClose={() => setDeleting(false)}
        />
      )}
    </>
  );
}