"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
  Loader2,
  BadgeCheck,
  Bookmark,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest, authStorage, AuthUser } from "@/lib/api";

interface PopulatedTuition {
  _id: string;
  title?: string;
  subject?: string;
  classLevel?: string;
  mode?: "Online" | "Offline";
  location?: string;
  monthlyFee?: number;
  tutorName?: string;
}

interface StudentApplication {
  _id: string;
  tuitionId: string | PopulatedTuition;
  tuitionTitle: string;
  phone?: string;
  preferredSchedule: string;
  note?: string;
  isPriority?: boolean;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: string;
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [bookmarks, setBookmarks] = useState<PopulatedTuition[]>([]);
  const [removingBookmarkId, setRemovingBookmarkId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(authStorage.getUser());
    };
    syncUser();
    window.addEventListener("mentorlagbe-auth-change", syncUser);
    return () => window.removeEventListener("mentorlagbe-auth-change", syncUser);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!authStorage.getToken()) {
        setIsLoading(false);
        router.push("/sign-in");
        return;
      }

      setIsLoading(true);
      try {
        const [appResult, bookmarkResult] = await Promise.allSettled([
          apiRequest<{
            success: boolean;
            applications: StudentApplication[];
          }>("/applications/student/my", {
            auth: true,
          }),
          apiRequest<{
            success: boolean;
            bookmarks: PopulatedTuition[];
          }>("/bookmarks/my", {
            auth: true,
          }),
        ]);

        if (appResult.status === "fulfilled") {
          setApplications(appResult.value.applications || []);
        } else {
          const message =
            appResult.reason instanceof Error
              ? appResult.reason.message
              : "Failed to load your applications.";
          toast.error(message);
        }

        if (bookmarkResult.status === "fulfilled") {
          setBookmarks(bookmarkResult.value.bookmarks || []);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleRemoveBookmark = async (tuitionId: string) => {
    if (!tuitionId) return;
    setRemovingBookmarkId(tuitionId);
    try {
      const res = await apiRequest<{
        success: boolean;
        bookmarked: boolean;
        message: string;
      }>(`/bookmarks/toggle/${tuitionId}`, {
        method: "POST",
        auth: true,
      });

      setBookmarks((prev) => prev.filter((item) => item._id !== tuitionId));
      toast.success(res.message || "Removed from saved tuitions.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to remove bookmark.";
      toast.error(message);
    } finally {
      setRemovingBookmarkId(null);
    }
  };

  const totalCount = applications.length;
  const acceptedCount = applications.filter(
    (a) => a.status === "Accepted"
  ).length;
  const pendingCount = applications.filter(
    (a) => a.status === "Pending"
  ).length;
  const isProStudent = currentUser?.plan === "pro";

  const getStatusBadge = (status: "Pending" | "Accepted" | "Rejected") => {
    if (status === "Accepted") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
        </span>
      );
    }
    if (status === "Rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400">
          <XCircle className="w-3.5 h-3.5" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
        <Clock className="w-3.5 h-3.5" /> Pending
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Top Heading & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Student Dashboard
            </h1>
            {isProStudent && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <BadgeCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />{" "}
                Pro Student
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {currentUser?.name
              ? `Welcome back, ${currentUser.name} — track your tuition applications, saved tuitions, and enrollment statuses.`
              : "Track your tuition applications, saved tuitions, and enrollment statuses."}
          </p>
        </div>

        <Link
          href="/tuitions"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition"
        >
          Browse More Tuitions <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Applications
          </p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            {totalCount}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Submitted tuition requests
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Accepted Batches
          </p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {acceptedCount}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Confirmed mentorships
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pending Review
          </p>
          <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 mt-2">
            {pendingCount}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Awaiting tutor response
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Current Plan
          </p>
          <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-2 uppercase">
            {isProStudent ? "Pro" : "Free"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isProStudent
              ? `${bookmarks.length} saved • Unlimited bookmarks`
              : `${bookmarks.length} / 5 bookmarks used`}
          </p>
        </div>
      </div>

      {/* Pro Upgrade Banner for Students */}
      {!isProStudent && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Priority Booking & Unlimited
              Bookmarks ($10)
            </span>
            <h2 className="text-lg font-extrabold">
              Want unlimited bookmarks and priority batch booking?
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100">
              Upgrade to Pro Student ($10) via Stripe for priority applications
              and unlimited tuition bookmarks.
            </p>
          </div>
          <Link
            href="/pricing"
            className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm rounded-xl shrink-0 text-center transition"
          >
            View Pro Plans
          </Link>
        </div>
      )}

      {/* Saved Tuitions (Bookmarks) Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Saved Tuitions
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {isProStudent
              ? `${bookmarks.length} saved (Unlimited)`
              : `${bookmarks.length} / 5 used (Free Plan)`}
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-7 h-7 text-indigo-600 animate-spin mb-2" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Loading saved tuitions...
            </p>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12 px-6 space-y-2">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              No saved tuitions yet.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Bookmark any tuition from its details page to keep it handy here.
            </p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((item) => {
              const itemId = item._id;
              return (
                <div
                  key={itemId}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                      <span>{item.subject || "Tuition"}</span>
                      <span>
                        {typeof item.monthlyFee === "number"
                          ? `$${item.monthlyFee}/mo`
                          : item.mode || "Online"}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                      {item.title || "Tuition Listing"}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {item.tutorName ? `Tutor: ${item.tutorName}` : item.mode}
                      {item.location ? ` • ${item.location}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-700/70">
                    <Link
                      href={`/tuitions/${itemId}`}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      View & Apply
                    </Link>

                    <button
                      type="button"
                      disabled={removingBookmarkId === itemId}
                      onClick={() => handleRemoveBookmark(itemId)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {removingBookmarkId === itemId ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Applications Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            My Tuition Applications
          </h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {applications.length} records
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Loading your applications...
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-14 px-6 space-y-3">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              You haven&apos;t applied to any tuitions yet.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Explore approved batches and submit an application to get started.
            </p>
            <Link
              href="/tuitions"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
            >
              Browse Tuitions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3.5 px-6">Tuition & Subject</th>
                  <th className="py-3.5 px-6">Mode & Schedule</th>
                  <th className="py-3.5 px-6">Monthly Fee</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {applications.map((app) => {
                  const populated =
                    typeof app.tuitionId === "object" && app.tuitionId !== null
                      ? app.tuitionId
                      : null;
                  const tuitionLinkId =
                    populated?._id ||
                    (typeof app.tuitionId === "string" ? app.tuitionId : "");
                  const title =
                    app.tuitionTitle || populated?.title || "Tuition Listing";
                  const subject = populated?.subject || "Mentorship";
                  const mode = populated?.mode || "Online";
                  const location = populated?.location || mode;
                  const fee =
                    typeof populated?.monthlyFee === "number"
                      ? `$${populated.monthlyFee}/mo`
                      : "—";
                  const formattedDate = app.createdAt
                    ? new Date(app.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "";

                  return (
                    <tr
                      key={app._id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {title}
                          </p>
                          {app.isPriority && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                              <Sparkles className="w-3 h-3" /> Priority
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {subject}
                          {formattedDate ? ` • Applied ${formattedDate}` : ""}
                        </p>
                      </td>
                      <td className="py-4 px-6 space-y-1">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          {mode} — {location}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {app.preferredSchedule}
                        </p>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                        {fee}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {tuitionLinkId ? (
                          <Link
                            href={`/tuitions/${tuitionLinkId}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            View Tuition <BookOpen className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}