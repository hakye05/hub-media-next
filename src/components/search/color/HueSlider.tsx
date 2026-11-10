"use client";

import { clamp01, HUE_GRADIENT, hsvToHex, insetPos, THUMB_INSET } from "@/lib/color";
import ColorThumb from "./ColorThumb";
import { usePointerDrag } from "./usePointerDrag";

type Props = { hue: number; onChange: (hue: number) => void };

export default function HueSlider({ hue, onChange }: Props) {
  const { ref, dragging, handlers } = usePointerDrag(
    (x) => onChange(x * 360),
    (dx) => onChange(clamp01(hue / 360 + dx) * 360),
    THUMB_INSET
  );

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Hue"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(hue)}
      className="relative h-6 w-full cursor-pointer touch-none select-none outline-none focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-neutral-900/40"
      {...handlers}
    >
      <div
        className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 rounded-full"
        style={{ backgroundImage: HUE_GRADIENT }}
      />
      <ColorThumb
        color={hsvToHex({ h: hue, s: 1, v: 1 })}
        active={dragging}
        left={insetPos(hue / 360)}
        top="50%"
      />
    </div>
  );
}