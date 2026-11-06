import Image from "next/image";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export default function SearchInput({ value, onChange, placeholder }: Props) {
  return (
    <label className="flex h-14 w-full max-w-120 items-center gap-3 rounded-full border border-neutral-300/70 bg-white px-5">
      <Image src="/search.svg" alt="" width={22} height={22} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full bg-transparent text-[17px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
      />
    </label>
  );
}