"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authStorage, AuthUser } from "@/lib/api";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(decodeURIComponent(error));
      router.replace("/sign-in");
      return;
    }

    const token = searchParams.get("token");
    const rawUser = searchParams.get("user");

    if (!token || !rawUser) {
      toast.error("Missing authentication session data.");
      router.replace("/sign-in");
      return;
    }

    try {
      const parsedUser = JSON.parse(decodeURIComponent(rawUser)) as AuthUser;
      authStorage.setSession(token, parsedUser);
      toast.success("Signed in with Google successfully!");

      if (parsedUser.role === "tutor") {
        router.replace("/dashboard/tutor");
      } else {
        router.replace("/dashboard/student");
      }
    } catch {
      toast.error("Failed to parse Google sign-in user data.");
      router.replace("/sign-in");
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm text-center space-y-2">
        <p className="text-sm font-bold text-slate-800">
          Completing Google Sign-In...
        </p>
        <p className="text-xs text-slate-500">
          Please wait while we redirect you to your dashboard.
        </p>
      </div>
    </div>
  );
}