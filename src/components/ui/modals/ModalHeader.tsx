import CloseIcon from "../../icons/CloseIcon";

type Props = {
  title: string;
  onClose: () => void;
  disabled?: boolean;
  className?: string;
  titleClassName?: string;
};

export default function ModalHeader({
  title,
  onClose,
  disabled,
  className = "px-8 pb-2 pt-7",
  titleClassName = "text-[22px] font-semibold tracking-tight",
}: Props) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <h2 className={titleClassName}>{title}</h2>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        disabled={disabled}
        className="flex h-10 w-10 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-200/60 hover:text-neutral-900"
      >
        <CloseIcon />
      </button>
    </div>
  );
}