"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { hexToHsv, hsvToHex, isHex, type Hsv } from "@/lib/color";
import HueSlider from "./HueSlider";
import SaturationArea from "./SaturationArea";

type Props = { initial: string | null; onAdd: (hex: string) => void; above?: boolean };

const MOBILE_SIDE_GAP = 12;

export default function ColorPickerPopover({ initial, onAdd, above = false }: Props) {
  const [hsv, setHsv] = useState<Hsv>(() => hexToHsv(initial ?? "#000000"));
  const [draft, setDraft] = useState<string | null>(null); // hex text while typing
  const hex = hsvToHex(hsv);

  // Mobile: break out of the searchbar's container so the dialog spans the screen (minus side gaps).
  // Skipped when opening above, where the popover matches the bar's width instead.
  const ref = useRef<HTMLDivElement>(null);
  const [mobileLeft, setMobileLeft] = useState<number | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      const host = ref.current?.offsetParent as HTMLElement | null;
      setMobileLeft(
        host && !above && window.innerWidth < 640
          ? -host.getBoundingClientRect().left + MOBILE_SIDE_GAP
          : null
      );
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [above]);

  function patch(p: Partial<Hsv>) {
    setHsv((c) => ({ ...c, ...p }));
    setDraft(null);
  }

  function onHexChange(raw: string) {
    const text = "#" + raw.replace(/[^0-9a-fA-F]/g, "").slice(0, 6).toUpperCase();
    setDraft(text);
    if (isHex(text)) setHsv((c) => hexToHsv(text, c.h));
  }

  const placement = above
    ? "bottom-full mb-2 inset-x-0 starting:translate-y-1"
    : "top-full mt-2 starting:-translate-y-1 sm:left-auto sm:right-0 sm:w-96";

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Pick a color"
      style={{
        left: mobileLeft ?? undefined,
        width: mobileLeft !== null ? `calc(100vw - ${MOBILE_SIDE_GAP * 2}px)` : undefined,
      }}
      className={`absolute z-50 rounded-2xl rounded-b-[28px] sm:rounded-[28px] border border-neutral-300/70 bg-[#fbfaf8] p-2 shadow-xl transition duration-150 starting:opacity-0 motion-reduce:transition-none ${placement}`}
    >
      <SaturationArea hsv={hsv} onChange={patch} heightClassName={above ? "h-52" : "h-70"} />

      <div className="mt-2">
        <HueSlider hue={hsv.h} onChange={(h) => patch({ h })} />
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <label className="flex h-10 min-w-0 items-center gap-2 rounded-full border border-neutral-300/70 bg-white pl-1.5 pr-3">
          <span
            className="h-6 w-6 shrink-0 rounded-full border border-black/10"
            style={{ backgroundColor: hex }}
          />
          <input
            value={draft ?? hex}
            onChange={(e) => onHexChange(e.target.value)}
            onBlur={() => setDraft(null)}
            onKeyDown={(e) => e.key === "Enter" && onAdd(hex)}
            maxLength={7}
            spellCheck={false}
            aria-label="Hex color"
            className="w-[7.5ch] bg-transparent text-[16px] font-medium tabular-nums text-neutral-900 focus:outline-none"
          />
        </label>

        <button
          type="button"
          onClick={() => onAdd(hex)}
          className="inline-flex h-10 items-center justify-center rounded-full bg-[#111] px-4 pb-px text-[14px] font-semibold leading-none tracking-tight text-white transition-colors hover:bg-neutral-800"
        >
          Add
        </button>
      </div>
    </div>
  );
}