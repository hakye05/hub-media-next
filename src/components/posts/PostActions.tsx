import type { PostDetail } from "@/lib/posts";
import PencilIcon from "../icons/PencilIcon";
import { IconToolbarButton } from "../ui/Button";
import CopyLinkButton from "../ui/CopyLinkButton";
import DownloadButton from "./DownloadButton";
import SavePostButton from "./SavePostButton";

type Props = {
  post: PostDetail;
  isAuthor: boolean;
  onEdit: () => void;
};

export default function PostActions({ post, isAuthor, onEdit }: Props) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-nowrap items-center gap-2">
        <CopyLinkButton path={`/post/${post.id}`} />
        <DownloadButton url={post.imageUrl} title={post.title} />
        {isAuthor && (
          <IconToolbarButton label="Edit post" onClick={onEdit}>
            <PencilIcon />
          </IconToolbarButton>
        )}
      </div>
      <SavePostButton saved={post.savedByViewer} />
    </div>
  );
}