const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type StickerItem = {
  id: number;
  code: string;
  number: number;
};

export type TeamGroup = {
  team: string;
  stickers: StickerItem[];
};

export type CatalogResponse = {
  teams: TeamGroup[];
};

export type UserStickerState = {
  sticker_id: number;
  code: string;
  owned: boolean;
};

export type Progress = {
  total: number;
  obtained: number;
  missing: number;
  percent: number;
};

const TOKEN_KEY = "figus_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!response.ok) {
    let detail = "Error de conexión";
    try {
      const data = (await response.json()) as { detail?: string };
      if (data.detail) detail = data.detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

export const api = {
  register: (body: { nickname: string; email: string; password: string }) =>
    request<TokenResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    request<TokenResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getCatalog: () => request<CatalogResponse>("/api/stickers"),
  getMyStickers: () =>
    request<{ items: UserStickerState[] }>("/api/me/stickers"),
  getProgress: () => request<Progress>("/api/me/progress"),
  toggleSticker: (stickerId: number) =>
    request<UserStickerState>(`/api/me/stickers/${stickerId}`, {
      method: "PATCH",
      body: JSON.stringify({}),
    }),
};
