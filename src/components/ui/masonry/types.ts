export type MasonryItem<T> = {
  id: string;
  ratio: number;
  data: T;
};

export type MasonryLayout<T> = {
  columnCount: number;
  columns: MasonryItem<T>[][];
  placed: Map<string, number>;
};