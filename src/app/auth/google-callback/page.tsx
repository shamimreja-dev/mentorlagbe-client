"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { apiRequest, authStorage, AuthUser, UserRole } from "@/lib/api";

interface ExchangeGoogleResponse {
  success: boolean;
  token: string;
  user: AuthUser;
}

const getDashboardPath = (role?: UserRole) => {
  switch (role) {
    case "admin":
      return "/dashboard/admin";
    case "tutor":
      return "/dashboard/tutor";
    case "student":
    default:
      return "/dashboard/student";
  }
};

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusText, setStatusText] = useState("Completing Google sign-in...");

  useEffect(() => {
    let isMounted = true;

    const completeLogin = async () => {
      const errorParam = searchParams.get("error");
      if (errorParam) {
        toast.error(decodeURIComponent(errorParam));
        router.replace("/sign-in");
        return;
      }

      const code = searchParams.get("code");
      if (!code) {
        toast.error("Missing Google sign-in code.");
        router.replace("/sign-in");
        return;
      }

      try {
        const res = await apiRequest<ExchangeGoogleResponse>(
          "/auth/google/exchange",
          {
            method: "POST",
            body: JSON.stringify({ code }),
          }
        );

        if (!res?.token || !res?.user) {
          throw new Error("Invalid session response from server.");
        }

        authStorage.setSession(res.token, res.user);
        toast.success("Signed in with Google successfully.");

        if (isMounted) {
          setStatusText("Redirecting to your dashboard...");
          router.replace(getDashboardPath(res.user.role));
          router.refresh();
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to complete Google sign-in.";
        toast.error(message);
        if (isMounted) {
          router.replace("/sign-in");
        }
      }
    };

    completeLogin();

    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center shadow-sm">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {statusText}
        </p>
      </div>
    </div>
  );
}