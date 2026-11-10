export type Hsv = { h: number; s: number; v: number }; // h 0–360, s/v 0–1

export const HUE_GRADIENT =
  "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)";

const HEX = /^#?[0-9a-f]{6}$/i;

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export const isHex = (raw: string) => HEX.test(raw);

export const normalizeHex = (raw: string) =>
  `#${raw.replace("#", "").toUpperCase()}`;

/** Reads a ?color= param; returns "#RRGGBB" or null if missing/invalid. */
export function parseColorParam(raw: string | null): string | null {
  return raw && isHex(raw) ? normalizeHex(raw) : null;
}

export function hsvToHex({ h, s, v }: Hsv): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const hex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${hex(f(5))}${hex(f(3))}${hex(f(1))}`.toUpperCase();
}

/** `fallbackHue` is kept for greys, where the hue is undefined. */
export function hexToHsv(hex: string, fallbackHue = 0): Hsv {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = fallbackHue;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max };
}

export function readableOn(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const lum = 0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255);
  return lum > 150 ? "#111111" : "#ffffff";
}

/** Thumb radius incl. its grow-on-drag scale; keeps the thumb inside rounded ends. */
export const THUMB_INSET = 10;

/** Position for p in 0..1, inset from both edges by `inset` px. */
export const insetPos = (p: number, inset = THUMB_INSET) =>
  `calc(${inset}px + ${p} * (100% - ${inset * 2}px))`;