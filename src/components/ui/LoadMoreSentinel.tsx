"use client";

import { useEffect, useRef } from "react";

type Props = { onVisible: () => void; disabled?: boolean };

export default function LoadMoreSentinel({ onVisible, disabled }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && onVisible(),
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible, disabled]);

  return <div ref={ref} className="h-1" aria-hidden />;
}