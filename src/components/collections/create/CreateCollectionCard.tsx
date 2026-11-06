type Props = { onClick: () => void };

export default function CreateCollectionCard({ onClick }: Props) {
  return (
    <button type="button" onClick={onClick} className="group block w-full text-left">
      <div className="flex aspect-square items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50 text-neutral-400 transition-colors group-hover:bg-neutral-100 group-hover:text-neutral-500">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
      <p className="mt-2 text-[15px] font-semibold text-neutral-900">New collection</p>
      <p className="text-[13px] text-neutral-500">Group related posts</p>
    </button>
  );
}