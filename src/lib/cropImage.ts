export type PixelArea = { x: number; y: number; width: number; height: number };

type Options = { maxWidth: number; fileName: string };

export class CropError extends Error {}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new CropError("Couldn't read the image. Try another one."));
    img.src = src;
  });
}

/** Crops `src` to `area` (in source pixels) and returns it as a JPEG file. */
export async function cropToFile(
  src: string,
  area: PixelArea,
  { maxWidth, fileName }: Options
): Promise<File> {
  const img = await loadImage(src);

  const scale = Math.min(1, maxWidth / area.width);
  const width = Math.round(area.width * scale);
  const height = Math.round(area.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new CropError("Couldn't process the image. Try another one.");

  // JPEG has no alpha: fill first so transparent PNG areas come out white, not black
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.92)
  );
  if (!blob) throw new CropError("Couldn't process the image. Try another one.");

  return new File([blob], fileName, { type: "image/jpeg" });
}