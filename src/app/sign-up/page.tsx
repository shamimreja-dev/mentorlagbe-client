"use client";

import { useState } from "react";
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

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "tutor">("student");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
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

      if (res.user.role === "tutor") {
        router.push("/dashboard/tutor");
      } else {
        router.push("/dashboard/student");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create account.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-14 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-lg p-8 sm:p-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
            <Sparkles className="w-3.5 h-3.5" /> Free Plan Included
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Create Your Account
          </h1>
          <p className="text-sm text-slate-500">
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
                ? "border-indigo-600 bg-indigo-50/60 text-indigo-900"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <GraduationCap
              className={`w-6 h-6 shrink-0 ${
                role === "student" ? "text-indigo-600" : "text-slate-400"
              }`}
            />
            <div>
              <p className="font-bold text-sm">Student</p>
              <p className="text-[11px] opacity-75">Find & apply tuitions</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setRole("tutor")}
            className={`p-4 rounded-2xl border-2 text-left transition flex items-center gap-3 ${
              role === "tutor"
                ? "border-indigo-600 bg-indigo-50/60 text-indigo-900"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Briefcase
              className={`w-6 h-6 shrink-0 ${
                role === "tutor" ? "text-indigo-600" : "text-slate-400"
              }`}
            />
            <div>
              <p className="font-bold text-sm">Tutor</p>
              <p className="text-[11px] opacity-75">Host batches & mentor</p>
            </div>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>
          </div>

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
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="+88017xxxxxxxx"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                minLength={6}
                placeholder="At least 6 characters"
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
            {isSubmitting
              ? "Creating Account..."
              : `Sign Up as ${role === "student" ? "Student" : "Tutor"}`}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-indigo-600 hover:text-indigo-700 font-bold"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}