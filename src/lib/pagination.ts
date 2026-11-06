export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

export const pageQuery = (cursor?: string | null, size = 20) => {
  const params = new URLSearchParams({ size: String(size) });
  if (cursor) params.set("cursor", cursor);
  return params.toString();
};