"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { computeColumnCount } from "./computeColumnCount";

type Options = {
  minColumnWidth: number;
  gap: number;
  min?: number;
  max?: number;
};

export function useColumnCount({
  minColumnWidth,
  gap,
  min = 2,
  max = 6,
}: Options) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(min);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () =>
      setCount(
        computeColumnCount(el.clientWidth, { minColumnWidth, gap, min, max })
      );

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [minColumnWidth, gap, min, max]);

  return [ref, count] as const;
}