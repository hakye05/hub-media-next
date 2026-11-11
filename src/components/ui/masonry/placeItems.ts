import type { MasonryItem, MasonryLayout } from "./types";

type Slot<T> = { item: MasonryItem<T>; index: number };

function shortestColumn(heights: number[]): number {
  let best = 0;
  for (let i = 1; i < heights.length; i++) {
    if (heights[i] < heights[best]) best = i;
  }
  return best;
}

/**
 * Append-only placement:
 * - items that were already placed keep their column
 * - new items go to the currently shortest column
 * - a full re-layout happens only when the column count changes or
 *   several items disappear at once (e.g. a search filter changed)
 */
export function placeItems<T>(
  prev: MasonryLayout<T> | null,
  items: MasonryItem<T>[],
  columnCount: number
): MasonryLayout<T> {
  const present = new Set(items.map((i) => i.id));
  let keep = prev && prev.columnCount === columnCount ? prev.placed : null;

  if (keep) {
    let removed = 0;
    for (const id of keep.keys()) if (!present.has(id)) removed++;
    if (removed > 1) keep = null;
  }

  const slots: Slot<T>[][] = Array.from({ length: columnCount }, () => []);
  const heights = new Array<number>(columnCount).fill(0);
  const placed = new Map<string, number>();
  const fresh: Slot<T>[] = [];

  items.forEach((item, index) => {
    const col = keep?.get(item.id);
    if (col === undefined) {
      fresh.push({ item, index });
      return;
    }
    slots[col].push({ item, index });
    heights[col] += item.ratio;
    placed.set(item.id, col);
  });

  for (const slot of fresh) {
    const col = shortestColumn(heights);
    slots[col].push(slot);
    heights[col] += slot.item.ratio;
    placed.set(slot.item.id, col);
  }

  const columns = slots.map((column) =>
    column.sort((a, b) => a.index - b.index).map((s) => s.item)
  );

  return { columnCount, columns, placed };
}