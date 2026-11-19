"use client";

import { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest, authStorage, AuthUser } from "@/lib/api";

export default function CreateTuitionPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [currentPostsCount, setCurrentPostsCount] = useState(0);
  const [isLoadingMeta, setIsLoadingMeta] = useState(true);

  const maxFreePosts = 2;

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

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(authStorage.getUser());
    };
    syncUser();
    window.addEventListener("mentorlagbe-auth-change", syncUser);
    return () => window.removeEventListener("mentorlagbe-auth-change", syncUser);
  }, []);

  useEffect(() => {
    const fetchTutorPostsCount = async () => {
      if (!authStorage.getToken()) {
        setIsLoadingMeta(false);
        router.push("/sign-in");
        return;
      }

      try {
        const res = await apiRequest<{
          success: boolean;
          tuitions: { _id: string }[];
        }>("/tuitions/tutor/my", { auth: true });

        setCurrentPostsCount(res.tuitions?.length || 0);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to check posting quota.";
        toast.error(message);
      } finally {
        setIsLoadingMeta(false);
      }
    };

    fetchTutorPostsCount();
  }, [router]);

  const plan = currentUser?.plan || "free";
  const isLimitReached = plan === "free" && currentPostsCount >= maxFreePosts;

  const handleCreateTuition = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || !authStorage.getToken()) {
      toast.error("Please sign in as a Tutor to post a tuition.");
      router.push("/sign-in");
      return;
    }

    if (currentUser.role !== "tutor") {
      toast.error("Only users with a Tutor role can publish tuitions.");
      return;
    }

    if (isLimitReached) {
      toast.error(
        `Free plan limit reached (${maxFreePosts}/${maxFreePosts}). Upgrade to Pro Tutor Plan ($15) for unlimited posts!`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        message?: string;
      }>("/tuitions", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          title: title.trim(),
          subject,
          classLevel: classLevel.trim(),
          mode,
          location: location.trim(),
          monthlyFee: Number(monthlyFee),
          daysPerWeek: Number(daysPerWeek),
          bannerImage: bannerImage.trim() || undefined,
          description: description.trim(),
        }),
      });

      toast.success(
        res.message || "Tuition submitted for admin approval (status: pending)!"
      );
      router.push("/dashboard/tutor");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create tuition listing.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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

      {/* Quota Indicator */}
      {!isLoadingMeta && plan === "free" && (
        <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-600">
            Free Plan Listing Quota:{" "}
            <strong className="text-slate-900">
              {currentPostsCount} / {maxFreePosts}
            </strong>{" "}
            used
          </span>
          <Link
            href="/pricing"
            className="font-bold text-indigo-600 hover:text-indigo-700"
          >
            Unlock Unlimited ($15) →
          </Link>
        </div>
      )}

      {/* Free Plan Limit Alert */}
      {!isLoadingMeta && isLimitReached && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Free Limit Reached (
              {currentPostsCount}/{maxFreePosts})
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
            disabled={isSubmitting || isLimitReached}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-md transition"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <PlusCircle className="w-4 h-4" />
            )}
            {isSubmitting ? "Publishing..." : "Submit for Approval"}
          </button>
        </div>
      </form>
    </div>
  );
}