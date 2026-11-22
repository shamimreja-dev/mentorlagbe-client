
import { createAuthClient } from "better-auth/react";

// Backend API URL
const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://mentorlagbe-server-fy1s.onrender.com";

// Normalize backend URL
const normalizedBaseUrl = rawApiUrl
  .trim()
  .replace(/\/+$/, "")
  .replace(/\/api\/better-auth$/i, "")
  .replace(/\/api$/i, "");

if (!normalizedBaseUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is missing");
}

// Create Better Auth Client
export const authClient = createAuthClient({
  baseURL: normalizedBaseUrl,

  basePath: "/api/better-auth",

  fetchOptions: {
    credentials: "include",
  },
});
