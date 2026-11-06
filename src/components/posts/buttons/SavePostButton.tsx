import BookmarkIcon from "@/components/icons/BookmarkIcon";
import { IconSolidButton } from "@/components/ui/Button";

type Props = { saved: boolean; size?: "md" | "sm" };

// Placeholder: will save to the private "Saved" collection and offer a collection picker
export default function SavePostButton({ saved, size }: Props) {
  return (
    <IconSolidButton label={saved ? "Saved" : "Save"} size={size}>
      <BookmarkIcon filled={saved} />
    </IconSolidButton>
  );
}