
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type UserRole = "student" | "tutor" | "admin";

const DEMO_USERS: Record<
  UserRole,
  { email: string; password: string; label: string }
> = {
  student: {
    email: "ariful.student@mentorlagbe.com",
    password: "MentorLagbe@123",
    label: "Student",
  },
  tutor: {
    email: "tanvir.tutor@mentorlagbe.com",
    password: "MentorLagbe@123",
    label: "Pro Tutor",
  },
  admin: {
    email: "admin@mentorlagbe.com",
    password: "MentorLagbe@123",
    label: "Admin",
  },
};

const getDashboardPath = (role?: string) => {
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

export default function SignInPage() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] =
    useState<UserRole>("student");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Email and Password Login
  const handleSignIn = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Failed to sign in."
        );
      }

      const user = result.data?.user as
        | { role?: UserRole }
        | undefined;

      toast.success("Welcome back! Signed in successfully.");

      // Use the role returned by the authenticated user.
      // Never trust the role selector as proof of authorization.
      router.replace(getDashboardPath(user?.role));

      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to sign in.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo role selection
  const handleSelectDemoRole = (role: UserRole) => {
    const demo = DEMO_USERS[role];

    setSelectedRole(role);
    setEmail(demo.email);
    setPassword(demo.password);

    toast.info(`Selected ${demo.label}`);
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);

    try {
      const callbackURL = `${window.location.origin}${getDashboardPath(
        selectedRole
      )}`;

      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL,
        errorCallbackURL: `${window.location.origin}/login`,
      });

      if (result.error) {
        throw new Error(
          result.error.message || "Google sign-in failed."
        );
      }

      // Better Auth handles the OAuth redirect.
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Google sign-in failed.";

      toast.error(message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-14 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-8 sm:p-10 space-y-7">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Welcome Back
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your MentorLagbe account and dashboard.
          </p>
        </div>

        {/* Role Selector */}
        <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 rounded-2xl p-3">
          <div className="grid grid-cols-3 gap-2">
            {(
              ["student", "tutor", "admin"] as UserRole[]
            ).map((roleKey) => {
              const isSelected = selectedRole === roleKey;

              return (
                <button
                  key={roleKey}
                  type="button"
                  onClick={() => handleSelectDemoRole(roleKey)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition border ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-700 dark:hover:text-indigo-300"
                  }`}
                >
                  {roleKey === "student"
                    ? "Student"
                    : roleKey === "tutor"
                      ? "Tutor"
                      : "Admin"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Email and Password Form */}
        <form
          onSubmit={handleSignIn}
          className="space-y-4"
          autoComplete="on"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Email Address *
            </label>

            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />

              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Password *
            </label>

            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 absolute right-3.5 top-3.5 transition"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isSubmitting || isGoogleLoading}
            className="w-full py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 group"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}

            {!isSubmitting && (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            )}
          </button>
        </form>

        {/* Divider and Google Login */}
        <div className="space-y-3 pt-1">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />

            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              OR
            </span>

            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          </div>

          <button
            type="button"
            disabled={isGoogleLoading || isSubmitting}
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 disabled:opacity-60 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 shadow-xs transition flex items-center justify-center gap-2.5"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.54-1.14 2.85-2.4 3.72v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.21z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>

            {isGoogleLoading
              ? "Connecting Google..."
              : "Continue with Google"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Don&apos;t have an account?{" "}

          <Link
            href="/sign-up"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold"
          >
            Create One
          </Link>
        </p>
      </div>
    </div>
  );
}
