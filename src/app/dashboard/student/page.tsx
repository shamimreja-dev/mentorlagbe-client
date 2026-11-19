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
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest, authStorage, AuthUser } from "@/lib/api";

interface PopulatedTuition {
  _id: string;
  title?: string;
  subject?: string;
  mode?: "Online" | "Offline";
  location?: string;
  monthlyFee?: number;
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
    const fetchMyApplications = async () => {
      if (!authStorage.getToken()) {
        setIsLoading(false);
        router.push("/sign-in");
        return;
      }

      setIsLoading(true);
      try {
        const res = await apiRequest<{
          success: boolean;
          applications: StudentApplication[];
        }>("/applications/student/my", {
          auth: true,
        });

        setApplications(res.applications || []);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load your applications.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyApplications();
  }, [router]);

  const totalCount = applications.length;
  const acceptedCount = applications.filter(
    (a) => a.status === "Accepted"
  ).length;
  const pendingCount = applications.filter(
    (a) => a.status === "Pending"
  ).length;

  const getStatusBadge = (status: "Pending" | "Accepted" | "Rejected") => {
    if (status === "Accepted") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
        </span>
      );
    }
    if (status === "Rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
          <XCircle className="w-3.5 h-3.5" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
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
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Student Dashboard
            </h1>
            {currentUser?.plan === "pro" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                <BadgeCheck className="w-3.5 h-3.5 text-amber-600" /> Pro Student
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {currentUser?.name
              ? `Welcome back, ${currentUser.name} — track your tuition applications and enrollment statuses.`
              : "Track your tuition applications, schedules, and enrollment statuses."}
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Applications
          </p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {totalCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Submitted tuition requests
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Accepted Batches
          </p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">
            {acceptedCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">Confirmed mentorships</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pending Review
          </p>
          <p className="text-3xl font-extrabold text-amber-600 mt-2">
            {pendingCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">Awaiting tutor response</p>
        </div>
      </div>

      {/* Pro Upgrade Banner for Students */}
      {currentUser?.plan !== "pro" && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Priority Booking ($10)
            </span>
            <h2 className="text-lg font-extrabold">
              Want faster tutor responses and priority batch booking?
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100">
              Upgrade to Pro Student ($10) via Stripe and stand out on every
              tuition application.
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

      {/* Applications Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">
            My Tuition Applications
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {applications.length} records
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
            <p className="text-xs font-medium text-slate-500">
              Loading your applications...
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-14 px-6 space-y-3">
            <p className="text-sm font-bold text-slate-800">
              You haven&apos;t applied to any tuitions yet.
            </p>
            <p className="text-xs text-slate-500">
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
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Tuition & Subject</th>
                  <th className="py-3.5 px-6">Mode & Schedule</th>
                  <th className="py-3.5 px-6">Monthly Fee</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {applications.map((app) => {
                  const populated =
                    typeof app.tuitionId === "object" && app.tuitionId !== null
                      ? app.tuitionId
                      : null;
                  const tuitionLinkId =
                    populated?._id ||
                    (typeof app.tuitionId === "string" ? app.tuitionId : "");
                  const title =
                    app.tuitionTitle ||
                    populated?.title ||
                    "Tuition Listing";
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
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-slate-900">{title}</p>
                          {app.isPriority && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                              <Sparkles className="w-3 h-3" /> Priority
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {subject}
                          {formattedDate ? ` • Applied ${formattedDate}` : ""}
                        </p>
                      </td>
                      <td className="py-4 px-6 space-y-1">
                        <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          {mode} — {location}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {app.preferredSchedule}
                        </p>
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-900">
                        {fee}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {tuitionLinkId ? (
                          <Link
                            href={`/tuitions/${tuitionLinkId}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
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