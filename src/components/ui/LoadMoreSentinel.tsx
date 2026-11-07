"use client";

import { useEffect, useRef } from "react";

type Props = { onVisible: () => void; disabled?: boolean; rootMargin?: string };

export default function LoadMoreSentinel({ onVisible, disabled, rootMargin = "300px" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    const observer = new IntersectionObserver(
      (entries) => entries[0]?.isIntersecting && onVisible(),
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible, disabled, rootMargin]);

  return <div ref={ref} className="h-1" aria-hidden />;
}