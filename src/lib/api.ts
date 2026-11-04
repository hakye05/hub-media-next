const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export type User = {
  id: string;
  email: string;
  username: string;
  displayName: string;
};

export type AuthResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

// Access token lives in memory only. The refresh cookie (httpOnly) restores it after a reload.
let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => {
  accessToken = t;
};

async function toApiError(res: Response): Promise<ApiError> {
  let message = "Something went wrong. Please try again.";
  try {
    const body = await res.json();
    message = body?.message ?? body?.detail ?? body?.error ?? message;
  } catch {
    /* non-JSON body */
  }
  return new ApiError(res.status, message);
}

type Options = Omit<RequestInit, "body"> & { json?: unknown };

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const { json, ...init } = options;
  const isAuthRoute = path.startsWith("/api/auth/");

  const send = () => {
    const headers = new Headers(init.headers);
    if (json !== undefined) headers.set("Content-Type", "application/json");
    if (accessToken && !isAuthRoute) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return fetch(`${BASE}${path}`, {
      ...init,
      headers,
      body: json !== undefined ? JSON.stringify(json) : undefined,
      credentials: "include",
    });
  };

  let res = await send();

  // Expired access token (Spring also rejects it on public endpoints): refresh once and retry.
  if (res.status === 401 && accessToken && !isAuthRoute) {
    try {
      await refreshSession();
      res = await send();
    } catch {
      setAccessToken(null);
    }
  }

  if (!res.ok) throw await toApiError(res);
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

// Single-flight: concurrent callers (React strict mode, several requests failing at once)
// share one refresh. Your backend rotates tokens and clears the cookie on a reused one,
// so two parallel refreshes would log the user out.
let refreshing: Promise<AuthResponse> | null = null;

export function refreshSession(): Promise<AuthResponse> {
  refreshing ??= api<AuthResponse>("/api/auth/refresh", { method: "POST" })
    .then((r) => {
      setAccessToken(r.accessToken);
      return r;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}