import type { PostDetail } from "@/lib/posts";
import PencilIcon from "@/components/icons/PencilIcon";
import { IconToolbarButton } from "@/components/ui/Button";
import CopyLinkButton from "@/components/ui/CopyLinkButton";
import DeletePostButton from "../buttons/DeletePostButton";
import DownloadButton from "../buttons/DownloadButton";
import SavePostButton from "../buttons/SavePostButton";

type Props = {
  post: PostDetail;
  isAuthor: boolean;
  onEdit: () => void;
  onDeleted: () => void;
};

export default function PostActions({ post, isAuthor, onEdit, onDeleted }: Props) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-nowrap items-center gap-2">
        <CopyLinkButton path={`/post/${post.id}`} />
        <DownloadButton url={post.imageUrl} title={post.title} />
        {isAuthor && (
          <>
            <IconToolbarButton label="Edit post" onClick={onEdit}>
              <PencilIcon />
            </IconToolbarButton>
            <DeletePostButton postId={post.id} onDeleted={onDeleted} />
          </>
        )}
      </div>
      <SavePostButton saved={post.savedByViewer} />
    </div>
  );
}