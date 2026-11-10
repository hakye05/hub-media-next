const BITS = 4;
const SHIFT = 8 - BITS;
const MIN_ALPHA = 125; // ignore transparent pixels
const MIN_GAP = 40; // min RGB distance between two picked colors

type Rgb = [number, number, number];

const toHex = ([r, g, b]: Rgb) =>
  "#" +
  [r, g, b]
    .map((c) => Math.round(c).toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

const distance = (a: Rgb, b: Rgb) =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/** RGBA pixels -> up to `max` distinct "#RRGGBB" colors, most dominant first. */
export function dominantColors(pixels: Uint8ClampedArray, max = 5): string[] {
  const bins = new Map<number, { n: number; r: number; g: number; b: number }>();

  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < MIN_ALPHA) continue;
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
    const key = ((r >> SHIFT) << (BITS * 2)) | ((g >> SHIFT) << BITS) | (b >> SHIFT);
    const bin = bins.get(key) ?? { n: 0, r: 0, g: 0, b: 0 };
    bin.n++;
    bin.r += r;
    bin.g += g;
    bin.b += b;
    bins.set(key, bin);
  }

  const picked: Rgb[] = [];
  const ranked = [...bins.values()].sort((a, b) => b.n - a.n);
  for (const bin of ranked) {
    const color: Rgb = [bin.r / bin.n, bin.g / bin.n, bin.b / bin.n];
    if (picked.every((p) => distance(p, color) >= MIN_GAP)) picked.push(color);
    if (picked.length === max) break;
  }
  return picked.map(toHex);
}