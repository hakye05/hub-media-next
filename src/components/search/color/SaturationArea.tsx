"use client";

import { clamp01, hsvToHex, insetPos, THUMB_INSET, type Hsv } from "@/lib/color";
import ColorThumb from "./ColorThumb";
import { usePointerDrag } from "./usePointerDrag";

type Props = { hsv: Hsv; onChange: (patch: Partial<Hsv>) => void };

export default function SaturationArea({ hsv, onChange }: Props) {
  const { ref, dragging, handlers } = usePointerDrag(
    (x, y) => onChange({ s: x, v: 1 - y }),
    (dx, dy) => onChange({ s: clamp01(hsv.s + dx), v: clamp01(hsv.v - dy) }),
    THUMB_INSET,
    THUMB_INSET
  );
  const hex = hsvToHex(hsv);

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label="Shade"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(hsv.s * 100)}
      aria-valuetext={hex}
      className="relative h-70 w-full cursor-crosshair touch-none select-none rounded-[20px] outline-none focus-visible:ring-2 shadow-xl focus-visible:ring-neutral-900/40"
      {...handlers}
    >
      <div
        className="absolute inset-0 rounded-[13px] sm:rounded-[20px]"
        style={{
          backgroundColor: `hsl(${hsv.h} 100% 50%)`,
          backgroundImage:
            "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
        }}
      />
      <ColorThumb
        color={hex}
        active={dragging}
        left={insetPos(hsv.s)}
        top={insetPos(1 - hsv.v)}
      />
    </div>
  );
}