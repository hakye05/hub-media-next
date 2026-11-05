import type { ReactNode } from "react";

export default function NavHeader({
  className = "",
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-50 bg-[#f6f5f3]/90 backdrop-blur">
      <nav className={`h-22.5 px-9 ${className}`}>{children}</nav>
    </header>
  );
}