type Options = {
  minColumnWidth: number;
  gap: number;
  min: number;
  max: number;
};

export function computeColumnCount(
  containerWidth: number,
  { minColumnWidth, gap, min, max }: Options
): number {
  if (containerWidth <= 0) return min;
  const fit = Math.floor((containerWidth + gap) / (minColumnWidth + gap));
  return Math.min(max, Math.max(min, fit));
}