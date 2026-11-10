type Params = { q?: string; color?: string | null; type?: string };

export function searchUrl({ q, color, type }: Params): string {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  if (color) p.set("color", color.replace("#", ""));
  if (type) p.set("type", type);
  return `/search?${p}`;
}