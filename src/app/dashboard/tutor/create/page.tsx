"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  DollarSign,
  MapPin,
  Calendar,
  Image as ImageIcon,
  PlusCircle,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

export default function CreateTuitionPage() {
  const router = useRouter();

  // ডেমো টিউটর প্ল্যান ও বর্তমান পোস্ট সংখ্যা
  const plan: "free" | "pro" = "free";
  const currentPostsCount = 2;
  const maxFreePosts = 2;
  const isLimitReached = plan === "free" && currentPostsCount >= maxFreePosts;

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Higher Mathematics");
  const [classLevel, setClassLevel] = useState("HSC (Class 11-12)");
  const [mode, setMode] = useState<"Online" | "Offline">("Online");
  const [location, setLocation] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("35");
  const [daysPerWeek, setDaysPerWeek] = useState("3");
  const [bannerImage, setBannerImage] = useState(
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800"
  );
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTuition = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLimitReached) {
      toast.error(
        "Free plan limit reached (2/2). Upgrade to Pro Tutor Plan ($15) for unlimited posts!"
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        "Tuition submitted for admin approval (status: pending)!"
      );
      router.push("/dashboard/tutor");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Post New Tuition
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create a tuition batch or 1-on-1 mentorship listing for students.
          </p>
        </div>

        <Link
          href="/dashboard/tutor"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Tutor Dashboard
        </Link>
      </div>

      {/* Free Plan Limit Alert */}
      {isLimitReached && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Free Limit Reached ({currentPostsCount}/{maxFreePosts})
            </span>
            <p className="text-sm font-bold text-slate-900 pt-1">
              Upgrade to Pro Tutor Plan ($15) to publish unlimited tuitions.
            </p>
          </div>
          <Link
            href="/pricing"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl text-center shrink-0 transition"
          >
            Upgrade with Stripe ($15)
          </Link>
        </div>
      )}

      {/* Tuition Form */}
      <form
        onSubmit={handleCreateTuition}
        className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Tuition Title *
            </label>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="e.g. HSC Higher Math & Calculus Intensive Batch"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Subject *
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
            >
              <option value="Higher Mathematics">Higher Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Programming">Programming</option>
              <option value="IELTS & English">IELTS & English</option>
              <option value="Biology">Biology</option>
              <option value="Chemistry">Chemistry</option>
            </select>
          </div>

          {/* Class Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Class / Academic Level *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. HSC (Class 11-12), O-Level, University"
              value={classLevel}
              onChange={(e) => setClassLevel(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
            />
          </div>

          {/* Mode */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Teaching Mode *
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as "Online" | "Offline")}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
            >
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Location / Platform *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder={
                  mode === "Online"
                    ? "e.g. Zoom / Google Meet"
                    : "e.g. Dhanmondi, Dhaka"
                }
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>
          </div>

          {/* Monthly Fee (USD) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Monthly Fee (USD $) *
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="number"
                min="1"
                required
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>
          </div>

          {/* Days Per Week */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Classes Per Week *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="number"
                min="1"
                max="7"
                required
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>
          </div>

          {/* Banner Image URL */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Banner Image URL
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="url"
                placeholder="https://..."
                value={bannerImage}
                onChange={(e) => setBannerImage(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
              />
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Course / Mentorship Description *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Describe syllabus coverage, batch timing, teaching approach, and who this tuition is for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition resize-none"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            {isSubmitting ? "Publishing..." : "Submit for Approval"}
          </button>
        </div>
      </form>
    </div>
  );
}