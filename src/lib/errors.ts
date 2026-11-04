import { ApiError } from "./api";

export const getErrorMessage = (err: unknown) =>
  err instanceof ApiError ? err.message : "Can't reach the server. Please try again.";