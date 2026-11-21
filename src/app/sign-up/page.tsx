"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Phone,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest, authStorage, AuthUser } from "@/lib/api";

const getDashboardPath = (role?: string) => {
  if (role === "admin") return "/dashboard/admin";
  if (role === "tutor") return "/dashboard/tutor";
  return "/dashboard/student";
};

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "tutor">("student");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = authStorage.getToken();
    const existingUser = authStorage.getUser();

    if (token && existingUser) {
      router.replace(getDashboardPath(existingUser.role));
    }
  }, [router]);

  const handlePhoneChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 11);
    setPhone(digitsOnly);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{11}$/.test(phone)) {
      toast.error("Phone number must be exactly 11 digits (e.g. 01712345678).");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await apiRequest<{
        success: boolean;
        message: string;
        token: string;
        user: AuthUser;
      }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, phone, password, role }),
      });

      authStorage.setSession(res.token, res.user);
      toast.success(
        res.message ||
          `Account created as ${role.toUpperCase()} (Free Plan)! Welcome to MentorLagbe.`
      );

      router.push(getDashboardPath(res.user.role));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create account.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-14 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors">
      <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg p-8 sm:p-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" /> Free Plan Included
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Create Your Account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Join MentorLagbe as a Student or Tutor and start immediately.
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setRole("student")}
            className={`p-4 rounded-2xl border-2 text-left transition flex items-center gap-3 ${
              role === "student"
                ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70"
            }`}
          >
            <GraduationCap
              className={`w-6 h-6 shrink-0 ${
                role === "student"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            />
            <div>
              <p className="font-bold text-sm">Student</p>
              <p className="text-[11px] opacity-75">Find &amp; apply tuitions</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole("tutor")}
            className={`p-4 rounded-2xl border-2 text-left transition flex items-center gap-3 ${
              role === "tutor"
                ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70"
            }`}
          >
            <Briefcase
              className={`w-6 h-6 shrink-0 ${
                role === "tutor"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            />
            <div>
              <p className="font-bold text-sm">Tutor</p>
              <p className="text-[11px] opacity-75">Host batches &amp; mentor</p>
            </div>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                autoComplete="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Phone Number * (11 Digits)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                inputMode="numeric"
                required
                autoComplete="tel"
                minLength={11}
                maxLength={11}
                pattern="\d{11}"
                placeholder="Enter you phone Number"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                autoComplete="new-password"
                minLength={6}
                placeholder="Choise a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 group"
          >
            {isSubmitting
              ? "Creating Account..."
              : `Sign Up as ${role === "student" ? "Student" : "Tutor"}`}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}