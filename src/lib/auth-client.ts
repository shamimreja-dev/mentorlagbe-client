
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://mentorlagbe-server-fy1s.onrender.com",
  basePath: "/api/better-auth",
  fetchOptions: {
    credentials: "include",
  },
});
