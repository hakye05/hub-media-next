import type { ReactNode } from "react";

type Props = {
  title: string;
  footer?: ReactNode;
  children: ReactNode;
};

export default function Pane({ title, footer, children }: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <h2 className="px-8 pb-2 pt-7 text-[22px] font-semibold tracking-tight">{title}</h2>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 pb-6 pt-3 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {children}
      </div>

      {footer && (
        <div className="flex items-center gap-4 border-t border-neutral-200 px-8 py-4">
          {footer}
        </div>
      )}
    </div>
  );
}