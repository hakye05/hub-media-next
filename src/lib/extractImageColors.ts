import { dominantColors } from "./palette";

const SAMPLE_SIZE = 100; // longest side, px

/** Downscales the image on a canvas and returns its dominant colors. */
export async function extractImageColors(file: File): Promise<string[]> {
  const bitmap = await createImageBitmap(file);
  try {
    const scale = Math.min(1, SAMPLE_SIZE / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return [];

    ctx.drawImage(bitmap, 0, 0, w, h);
    return dominantColors(ctx.getImageData(0, 0, w, h).data);
  } finally {
    bitmap.close();
  }
}