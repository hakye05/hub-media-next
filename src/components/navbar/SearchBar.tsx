import Image from "next/image";

const dots = [
  "bg-sky-400",
  "bg-amber-400",
  "bg-orange-500",
  "bg-fuchsia-500",
  "bg-indigo-500",
  "bg-teal-400",
];

export default function SearchBar() {
  return (
    <div className="flex w-full max-w-160 items-center gap-2 rounded-full border border-neutral-300/70 bg-neutral-200/40 p-2">
      {/* Input pill */}
      <label className="flex h-16 flex-1 items-center gap-3 rounded-full bg-white px-5 shadow-sm">
        <Image src="/search.svg" alt="" width={28} height={28} />
        <input
          type="text"
          placeholder="Search for posts"
          className="w-full bg-transparent text-[19px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
        />
      </label>

      {/* Round multicolor button */}
      <button
        type="button"
        aria-label="Visual search"
        className="relative h-16 w-16 shrink-0 rounded-full bg-white shadow-sm transition-transform hover:scale-105"
      >
        {dots.map((color, i) => (
          <span
            key={i}
            className={`absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full ${color}`}
            style={{
              transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-10px)`,
            }}
          />
        ))}
      </button>
    </div>
  );
}