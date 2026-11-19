"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, LogIn } from "lucide-react";
import { toast } from "sonner";
import { apiRequest, authStorage, AuthUser } from "@/lib/api";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await apiRequest<{
        success: boolean;
        message: string;
        token: string;
        user: AuthUser;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      authStorage.setSession(res.token, res.user);
      toast.success(res.message || "Welcome back! Signed in successfully.");

      if (res.user.role === "admin") {
        router.push("/dashboard/admin");
      } else if (res.user.role === "tutor") {
        router.push("/dashboard/tutor");
      } else {
        router.push("/dashboard/student");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sign in.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoUser = (demoEmail: string, demoPass: string, label: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    toast.info(`Filled ${label} demo credentials`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-14 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-lg p-8 sm:p-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500">
            Sign in to access your MentorLagbe account and dashboard.
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
            Quick Demo Fill
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() =>
                fillDemoUser(
                  "ariful.student@mentorlagbe.com",
                  "MentorLagbe@123",
                  "Student"
                )
              }
              className="py-2 px-2 bg-white hover:bg-indigo-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-700 transition"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() =>
                fillDemoUser(
                  "tanvir.tutor@mentorlagbe.com",
                  "MentorLagbe@123",
                  "Pro Tutor"
                )
              }
              className="py-2 px-2 bg-white hover:bg-indigo-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-700 transition"
            >
              Tutor
            </button>
            <button
              type="button"
              onClick={() =>
                fillDemoUser(
                  "admin@mentorlagbe.com",
                  "MentorLagbe@123",
                  "Admin"
                )
              }
              className="py-2 px-2 bg-white hover:bg-indigo-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-700 transition"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 group"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-indigo-600 hover:text-indigo-700 font-bold"
          >
            Create One
          </Link>
        </p>
      </div>
    </div>
  );
}