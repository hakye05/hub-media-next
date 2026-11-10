"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { clamp01 } from "@/lib/color";

const arrows = (s: number): Record<string, [number, number]> => ({
  ArrowLeft: [-s, 0],
  ArrowRight: [s, 0],
  ArrowUp: [0, -s],
  ArrowDown: [0, s],
});

/**
 * Drag (or arrow keys) over an element; reports x/y as 0..1 inside it.
 * insetX/insetY (px) shrink the active area so the thumb stays inside rounded ends;
 * pointer positions within the inset map to exactly 0 or 1.
 */
export function usePointerDrag(
  onChange: (x: number, y: number) => void,
  onNudge: (dx: number, dy: number) => void,
  insetX = 0,
  insetY = 0
) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  function report(e: PointerEvent) {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    onChange(
      clamp01((e.clientX - box.left - insetX) / (box.width - insetX * 2)),
      clamp01((e.clientY - box.top - insetY) / (box.height - insetY * 2))
    );
  }

  const handlers = {
    onPointerDown(e: PointerEvent<HTMLDivElement>) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
      report(e);
    },
    onPointerMove(e: PointerEvent<HTMLDivElement>) {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) report(e);
    },
    onPointerUp: () => setDragging(false),
    onPointerCancel: () => setDragging(false),
    onLostPointerCapture: () => setDragging(false),
    onKeyDown(e: KeyboardEvent) {
      const d = arrows(e.shiftKey ? 0.1 : 0.01)[e.key];
      if (!d) return;
      e.preventDefault();
      onNudge(d[0], d[1]);
    },
  };

  return { ref, dragging, handlers };
}