type Props = { onDelete: () => void };

export default function DeleteAccountRow({ onDelete }: Props) {
  return (
    <div className="mt-2 border-t border-neutral-200 pt-6">
      <p className="text-[15px] font-semibold text-neutral-900">Delete account</p>
      <p className="mt-1 text-[13px] leading-snug text-neutral-500">
        Permanently remove your account, posts, collections and saved items.
      </p>
      <button
        type="button"
        onClick={onDelete}
        className="mt-3 text-[14px] font-semibold text-red-600 transition-colors hover:text-red-700"
      >
        Delete account…
      </button>
    </div>
  );
}