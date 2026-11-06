import PlusIcon from "../icons/PlusIcon";
import { ToolbarButton } from "../ui/Button";

export default function CreatePostButton({ onClick }: { onClick: () => void }) {
  return (
    <ToolbarButton onClick={onClick}>
      <PlusIcon />
      Create
    </ToolbarButton>
  );
}