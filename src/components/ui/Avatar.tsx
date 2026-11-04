function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

type Props = {
  name: string;
  src?: string | null;
  className?: string;
  textClassName?: string;
};

export default function Avatar({
  name,
  src,
  className = "h-28 w-28",
  textClassName = "text-3xl",
}: Props) {
  if (src) {
    return (
      <img src={src} alt={name} className={`${className} rounded-full object-cover`} />
    );
  }
  return (
    <span
      className={`flex ${className} items-center justify-center rounded-full bg-linear-to-br from-rose-200 via-fuchsia-200 to-purple-300 font-semibold text-neutral-800 ${textClassName}`}
    >
      {initials(name)}
    </span>
  );
}