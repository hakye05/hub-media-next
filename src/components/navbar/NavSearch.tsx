import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { parseColorParam } from "@/lib/color";
import ColorChip from "../search/color/ColorChip";
import ColorPickerPopover from "../search/color/ColorPickerPopover";
import ColorTrigger from "../search/color/ColorTrigger";
import { useColorPopover } from "../search/color/useColorPopover";
import { useSearchSubmit } from "../search/useSearchSubmit";

export default function NavSearch() {
  const pathname = usePathname();
  const params = useSearchParams();
  const onSearch = pathname === "/search";
  const q = onSearch ? (params.get("q") ?? "").trim() : "";
  const color = onSearch ? parseColorParam(params.get("color")) : null;

  // key remounts the form when the query changes, so the input always shows what was searched
  return <NavSearchForm key={`${q}|${color ?? ""}`} initialValue={q} initialColor={color} />;
}

type Props = { initialValue: string; initialColor: string | null };

function NavSearchForm({ initialValue, initialColor }: Props) {
  const { value, setValue, color, applyColor, onSubmit } = useSearchSubmit(
    initialValue,
    initialColor
  );
  const picker = useColorPopover();

  return (
    <div ref={picker.ref} className="relative w-full">
      <form
        role="search"
        onSubmit={onSubmit}
        className="flex h-10 w-full items-center gap-1.5 rounded-full border border-neutral-300/70 bg-white/60 pl-2 pr-2 transition-colors focus-within:bg-white sm:h-12 sm:pr-3"
      >
        {color ? (
          <ColorChip
            hex={color}
            onRemove={() => applyColor(null)}
            className="h-6 w-6 sm:h-8 sm:w-8"
          />
        ) : (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center sm:h-8 sm:w-8">
            <Image src="/search.svg" alt="" width={22} height={22} />
          </span>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          enterKeyHint="search"
          aria-label="Search"
          placeholder="Search"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
        />
        <ColorTrigger
          open={picker.open}
          onClick={picker.toggle}
          className="h-6 w-6"
          dotClassName="h-1 w-1"
          radius={8}
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