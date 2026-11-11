"use client";

import type { ReactNode } from "react";
import { useColumnCount } from "./useColumnCount";
import { useMasonryLayout } from "./useMasonryLayout";

type Props<T> = {
  items: T[];
  getId: (item: T) => string;
  getRatio: (item: T) => number;
  renderItem: (item: T) => ReactNode;
  minColumnWidth?: number;
  /** Extra height under the image (title, footer…), in "ratio" units: px / column width */
  overhead?: number;
};

const GAP = 16; // average of gap-3 (12) and sm:gap-5 (20), used for column math only

export default function MasonryGrid<T>({
  items,
  getId,
  getRatio,
  renderItem,
  minColumnWidth = 180,
  overhead = 0,
}: Props<T>) {
  const [ref, columnCount] = useColumnCount({ minColumnWidth, gap: GAP });
  const layout = useMasonryLayout(items, columnCount, getId, getRatio, overhead);

  return (
    <div ref={ref} className="flex items-start gap-3 sm:gap-5">
      {layout.columns.map((column, i) => (
        <div key={i} className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-5">
          {column.map((entry) => (
            <div key={entry.id}>{renderItem(entry.data)}</div>
          ))}
        </div>
      ))}
    </div>
  );
}