import { createAuthClient } from "better-auth/react";

const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mentorlagbe-server-fy1s.onrender.com";

const normalizedBaseUrl = rawApiUrl
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api\/better-auth$/, "")
  .replace(/\/api$/, "");

export const authClient = createAuthClient({
  baseURL: normalizedBaseUrl,
  basePath: "/api/better-auth",
  fetchOptions: {
    credentials: "include",
  },
});