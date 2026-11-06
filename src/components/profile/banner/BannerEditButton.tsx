import PencilIcon from "../../icons/PencilIcon";

export default function BannerEditButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Change banner"
      onClick={onClick}
      className="absolute bottom-4 right-9 flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity hover:bg-black/70 focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
    >
      <PencilIcon />
    </button>
  );
}