"use client";

import Image from "next/image";
import ColorChip from "./color/ColorChip";
import ColorPickerPopover from "./color/ColorPickerPopover";
import ColorTrigger from "./color/ColorTrigger";
import { useColorPopover } from "./color/useColorPopover";
import { useSearchSubmit } from "./useSearchSubmit";

type Props = { initialValue?: string; initialColor?: string | null };

export default function SearchBar({ initialValue = "", initialColor = null }: Props) {
  const { value, setValue, color, applyColor, onSubmit } = useSearchSubmit(
    initialValue,
    initialColor
  );
  const picker = useColorPopover();

  return (
    <div ref={picker.ref} className="relative w-full max-w-160">
      <form
        role="search"
        onSubmit={onSubmit}
        className="flex w-full items-center gap-2 rounded-full border border-neutral-300/70 bg-neutral-200/40 p-1.5 sm:p-2"
      >
        <label
          className={`flex h-12 min-w-0 flex-1 items-center gap-2 rounded-full bg-white shadow-sm sm:h-16 sm:gap-3 ${
            color ? "pl-4 pr-5" : "px-4 sm:px-5"
          }`}
        >
          {color ? (
            <ColorChip hex={color} onRemove={() => applyColor(null)} />
          ) : (
            <Image src="/search.svg" alt="" width={28} height={28} className="h-5 w-5 sm:h-7 sm:w-7" />
          )}
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            enterKeyHint="search"
            aria-label="Search"
            placeholder={color ? "Search" : "Search posts and people"}
            className="min-w-0 flex-1 bg-transparent text-[16px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none sm:text-[19px]"
          />
        </label>

        <ColorTrigger
          open={picker.open}
          onClick={picker.toggle}
          className="h-12 w-12 bg-white shadow-sm sm:h-16 sm:w-16"
          dotClassName="h-1.5 w-1.5"
          radius={10}
        />
      </form>

      {picker.open && (
        <ColorPickerPopover
          initial={color}
          onAdd={(hex) => {
            applyColor(hex);
            picker.close();
          }}
        />
      )}
    </div>
  );
}