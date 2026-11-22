export type UserRole = "student" | "tutor" | "admin";
export type UserPlan = "free" | "pro";

export interface AuthUser {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  plan: UserPlan;
  isVerifiedTutor?: boolean;
  bio?: string;
}

const rawApiBase =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const cleanedApiBase = rawApiBase.trim().replace(/\/+$/, "");
const API_BASE_URL = cleanedApiBase.endsWith("/api")
  ? cleanedApiBase
  : `${cleanedApiBase}/api`;

const TOKEN_KEY = "mentorlagbe_token";
const USER_KEY = "mentorlagbe_user";

export const authStorage = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  setSession(token: string, user: AuthUser): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("mentorlagbe-auth-change"));
  },
  getUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },
  updateUser(user: AuthUser): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event("mentorlagbe-auth-change"));
  },
  clearSession(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("mentorlagbe-auth-change"));
  },
};

export interface ApiRequestOptions extends RequestInit {
  auth?: boolean;
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { auth = false, headers, body, ...rest } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = authStorage.getToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
    ...rest,
    headers: requestHeaders,
    body,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.message || `Request failed with status ${response.status}`;
    const error = new Error(message) as Error & {
      status?: number;
      code?: string;
    };
    error.status = response.status;
    error.code = data?.code;
    throw error;
  }

  return data as T;
}