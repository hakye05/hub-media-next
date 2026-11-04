import type { ReactNode } from "react";

export function AuthShell({
  logo,
  children,
  below,
  onClose,
  onBack,
}: {
  logo: ReactNode;
  children: ReactNode;
  below?: ReactNode;
  onClose: () => void;
  onBack?: () => void;
}) {
  return (
    <div className="relative flex h-full flex-col items-center py-10 px-10">
      {onBack && (
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Top: logo / dots */}
      <div className="flex h-10 shrink-0 items-center">{logo}</div>

      {/* Middle: main block is centered; `below` hangs under it without moving it */}
      <div className="grid min-h-0 w-full flex-1 grid-rows-[1fr_auto_1fr] pb-5">
        <div />
        <div className="w-full">{children}</div>
        <div className="w-full pt-6">{below}</div>
      </div>

      {/* Bottom: wordmark */}
      <span className="shrink-0 text-xl font-bold tracking-tight">HAKYE-HUB</span>
    </div>
  );
}