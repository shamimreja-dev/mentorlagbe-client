import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "")}/api/better-auth`
  : "https://mentorlagbe-server-fy1s.onrender.com/api/better-auth";

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: "include",
  },
});