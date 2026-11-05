import BookmarkIcon from "../icons/BookmarkIcon";
import { IconSolidButton } from "../ui/Button";

type Props = { saved: boolean };

// Placeholder: will save to the private "Saved" collection and offer a collection picker
export default function SavePostButton({ saved }: Props) {
  return (
    <IconSolidButton label={saved ? "Saved" : "Save"}>
      <BookmarkIcon filled={saved} />
    </IconSolidButton>
  );
}