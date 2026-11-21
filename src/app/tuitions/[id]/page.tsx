"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Clock,
  DollarSign,
  MapPin,
  ShieldCheck,
  Sparkles,
  Loader2,
  AlertCircle,
  Bookmark,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest, authStorage, AuthUser } from "@/lib/api";

interface TutorProfileInfo {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  plan?: "free" | "pro";
  isVerifiedTutor?: boolean;
}

interface TuitionDetail {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location?: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage?: string;
  description: string;
  tutorName: string;
  tutorVerified?: boolean;
  tutorId?: string | TutorProfileInfo;
}

interface StudentApplicationItem {
  _id?: string;
  tuitionId?: string | { _id?: string; id?: string };
}

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800";

const DEFAULT_TUTOR_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300";

export default function TuitionDetailsPage() {
  const params = useParams();
  const id = String(params?.id || "");

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [tuition, setTuition] = useState<TuitionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentNote, setStudentNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      const u = authStorage.getUser();
      setCurrentUser(u);
      if (u?.phone) {
        setStudentPhone((prev) => prev || u.phone);
      }
    };

    syncUser();
    window.addEventListener("mentorlagbe-auth-change", syncUser);
    return () => window.removeEventListener("mentorlagbe-auth-change", syncUser);
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchTuitionDetail = async () => {
      setIsLoading(true);
      setNotFound(false);
      try {
        const res = await apiRequest<{
          success: boolean;
          tuition: TuitionDetail;
        }>(`/tuitions/${id}`);

        setTuition(res.tuition);
      } catch (error) {
        setNotFound(true);
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load tuition details.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTuitionDetail();
  }, [id]);

  // Sync bookmark status and existing application status for logged-in student
  useEffect(() => {
    if (!id || !currentUser || currentUser.role !== "student") {
      setIsBookmarked(false);
      setHasApplied(false);
      return;
    }

    const syncStudentStates = async () => {
      try {
        const [bookmarkRes, appRes] = await Promise.allSettled([
          apiRequest<{
            success: boolean;
            bookmarks: Array<{ _id?: string; id?: string } | string>;
          }>("/bookmarks/my", { auth: true }),
          apiRequest<{
            success: boolean;
            applications: StudentApplicationItem[];
          }>("/applications/student/my", { auth: true }),
        ]);

        if (bookmarkRes.status === "fulfilled") {
          const savedIds = (bookmarkRes.value.bookmarks || []).map((item) =>
            typeof item === "string" ? item : item._id || item.id || ""
          );
          setIsBookmarked(savedIds.includes(id));
        }

        if (appRes.status === "fulfilled") {
          const appliedIds = (appRes.value.applications || []).map((app) => {
            if (!app.tuitionId) return "";
            if (typeof app.tuitionId === "string") return app.tuitionId;
            return app.tuitionId._id || app.tuitionId.id || "";
          });
          setHasApplied(appliedIds.includes(id));
        }
      } catch {
        // Ignore silent status check failure
      }
    };

    syncStudentStates();
  }, [id, currentUser]);

  const handleToggleBookmark = async () => {
    if (!currentUser) {
      toast.error("Please sign in as a Student to bookmark tuitions.");
      return;
    }

    if (currentUser.role !== "student") {
      toast.error("Only users with a Student role can bookmark tuitions.");
      return;
    }

    if (!tuition?._id) return;

    setIsBookmarking(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        bookmarked: boolean;
        message: string;
      }>(`/bookmarks/toggle/${tuition._id}`, {
        method: "POST",
        auth: true,
      });

      setIsBookmarked(Boolean(res.bookmarked));
      toast.success(
        res.message ||
          (res.bookmarked
            ? "Tuition bookmarked successfully."
            : "Removed from saved tuitions.")
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update bookmark.";
      toast.error(message);
    } finally {
      setIsBookmarking(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please sign in as a Student to apply for tuition.");
      return;
    }

    if (currentUser.role !== "student") {
      toast.error("Only users with a Student role can apply for tuitions!");
      return;
    }

    if (!tuition?._id) return;

    setIsSubmitting(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        message: string;
      }>("/applications", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          tuitionId: tuition._id,
          phone: studentPhone,
          preferredSchedule,
          note: studentNote,
        }),
      });

      setHasApplied(true);
      toast.success(
        res.message || "Tuition application submitted successfully!"
      );
      setPreferredSchedule("");
      setStudentNote("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit application.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-4 transition-colors">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Loading tuition details...
        </p>
      </div>
    );
  }

  if (notFound || !tuition) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Tuition Not Found
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This tuition listing may have been removed or is not yet approved.
          </p>
          <Link
            href="/tuitions"
            className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition"
          >
            Back to Tuitions
          </Link>
        </div>
      </div>
    );
  }

  const populatedTutor =
    typeof tuition.tutorId === "object" && tuition.tutorId !== null
      ? tuition.tutorId
      : null;

  const isVerified =
    Boolean(tuition.tutorVerified) ||
    Boolean(populatedTutor?.isVerifiedTutor) ||
    populatedTutor?.plan === "pro";

  const tutorBio =
    populatedTutor?.bio ||
    "Experienced mentor on MentorLagbe helping students achieve clear conceptual mastery and strong academic results.";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Tuition Banner & Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Banner Image */}
            <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-md bg-slate-200 dark:bg-slate-800">
              <img
                src={tuition.bannerImage || DEFAULT_BANNER}
                alt={tuition.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3.5 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-xl shadow">
                  {tuition.mode}
                </span>
                <span className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow">
                  ${tuition.monthlyFee} /mo
                </span>
              </div>
            </div>

            {/* Title & Info Meta */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
                    <span>{tuition.subject}</span>
                    <span>•</span>
                    <span>{tuition.classLevel}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    {tuition.title}
                  </h1>
                </div>

                {currentUser?.role === "student" && (
                  <button
                    type="button"
                    disabled={isBookmarking}
                    onClick={handleToggleBookmark}
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition shrink-0 ${
                      isBookmarked
                        ? "bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-950/70"
                        : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-700 dark:hover:text-indigo-300 hover:border-indigo-200 dark:hover:border-indigo-800"
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isBookmarked ? "fill-amber-500 text-amber-500" : ""
                      }`}
                    />
                    {isBookmarking
                      ? "Saving..."
                      : isBookmarked
                        ? "Bookmarked"
                        : "Bookmark"}
                  </button>
                )}
              </div>

              {/* Key Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Schedule
                    </p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {tuition.daysPerWeek} Days / Week
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Mode / Location
                    </p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {tuition.location || tuition.mode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Monthly Fee
                    </p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      ${tuition.monthlyFee}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  About This Tuition
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {tuition.description}
                </p>
              </div>

              {/* Tutor Profile Summary Card */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                <img
                  src={DEFAULT_TUTOR_AVATAR}
                  alt={tuition.tutorName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-600"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {tuition.tutorName}
                    </h4>
                    {isVerified && (
                      <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Tutor
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {tutorBio}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Role-Restricted Application Form / Notice */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-28 space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Apply for Tuition
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Submit your details to book this batch or mentorship.
                </p>
              </div>

              {!currentUser ? (
                <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-5 text-center space-y-3">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Sign in with a Student account to apply for this tuition.
                  </p>
                  <Link
                    href="/sign-in"
                    className="inline-block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition"
                  >
                    Sign In to Apply
                  </Link>
                </div>
              ) : currentUser.role === "student" ? (
                <>
                  {currentUser.plan === "pro" && (
                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-semibold">
                      <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>
                        Pro Student active: Your application will be highlighted
                        as Priority!
                      </span>
                    </div>
                  )}

                  {hasApplied && (
                    <div className="px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                      Application submitted! Track status in your Student
                      Dashboard.
                    </div>
                  )}

                  <form onSubmit={handleApply} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        disabled
                        value={currentUser.name}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-400 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Your Email
                      </label>
                      <input
                        type="email"
                        disabled
                        value={currentUser.email}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-400 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+88017xxxxxxxx"
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Preferred Schedule *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Evening (4 PM - 6 PM)"
                        value={preferredSchedule}
                        onChange={(e) => setPreferredSchedule(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Learning Note (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Mention any specific topic you want to focus on..."
                        value={studentNote}
                        onChange={(e) => setStudentNote(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 text-center space-y-3">
                  <p className="text-xs font-bold uppercase text-amber-800 dark:text-amber-300 tracking-wider">
                    Access Restricted
                  </p>
                  <p className="text-sm text-amber-900 dark:text-amber-200">
                    You are logged in as a{" "}
                    <strong className="uppercase">{currentUser.role}</strong>.
                    Only users with the{" "}
                    <strong className="underline">Student</strong> role are
                    allowed to apply for tuition batches.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}