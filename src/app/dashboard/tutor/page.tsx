"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest, authStorage, AuthUser } from "@/lib/api";

interface TutorTuitionItem {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  monthlyFee: number;
  approvalStatus?: "Pending" | "Approved" | "Rejected";
  status?: "Pending" | "Approved" | "Rejected";
  applicantsCount?: number;
}

interface PopulatedStudent {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  plan?: "free" | "pro";
}

interface PopulatedTuitionRef {
  _id?: string;
  title?: string;
}

interface IncomingApplication {
  _id: string;
  tuitionId: string | PopulatedTuitionRef;
  tuitionTitle?: string;
  studentId?: string | PopulatedStudent;
  studentName?: string;
  studentEmail?: string;
  phone?: string;
  preferredSchedule: string;
  note?: string;
  isPriority?: boolean;
  status: "Pending" | "Accepted" | "Rejected";
}

export default function TutorDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [tuitions, setTuitions] = useState<TutorTuitionItem[]>([]);
  const [applications, setApplications] = useState<IncomingApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const maxFreePosts = 2;

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(authStorage.getUser());
    };
    syncUser();
    window.addEventListener("mentorlagbe-auth-change", syncUser);
    return () => window.removeEventListener("mentorlagbe-auth-change", syncUser);
  }, []);

  useEffect(() => {
    const loadTutorData = async () => {
      if (!authStorage.getToken()) {
        setIsLoading(false);
        router.push("/sign-in");
        return;
      }

      setIsLoading(true);
      try {
        const [tuitionsRes, appsRes] = await Promise.all([
          apiRequest<{ success: boolean; tuitions: TutorTuitionItem[] }>(
            "/tuitions/tutor/my",
            { auth: true }
          ),
          apiRequest<{
            success: boolean;
            applications: IncomingApplication[];
          }>("/applications/tutor/incoming", { auth: true }),
        ]);

        setTuitions(tuitionsRes.tuitions || []);
        setApplications(appsRes.applications || []);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load tutor dashboard data.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTutorData();
  }, [router]);

  const handleStatusChange = async (
    appId: string,
    newStatus: "Accepted" | "Rejected"
  ) => {
    setUpdatingId(appId);
    try {
      const res = await apiRequest<{
        success: boolean;
        message?: string;
        application?: IncomingApplication;
      }>(`/applications/${appId}/status`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status: newStatus }),
      });

      setApplications((prev) =>
        prev.map((item) =>
          item._id === appId
            ? { ...item, status: res.application?.status || newStatus }
            : item
        )
      );
      toast.success(res.message || `Application marked as ${newStatus}!`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update application status.";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const plan = currentUser?.plan || "free";
  const isProTutor = plan === "pro" || Boolean(currentUser?.isVerifiedTutor);
  const isLimitReached = plan === "free" && tuitions.length >= maxFreePosts;
  const totalApplicants = applications.length;
  const acceptedStudents = applications.filter(
    (a) => a.status === "Accepted"
  ).length;

  return (
    <div className="space-y-8">
      {/* Header & Post Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Tutor Dashboard
            </h1>
            {isProTutor && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                <ShieldCheck className="w-3.5 h-3.5" /> Pro Tutor
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage your tuition batches, posting limits, and incoming student
            applications.
          </p>
        </div>

        <Link
          href="/dashboard/tutor/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" /> Post New Tuition
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Active Tuition Posts
          </p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {plan === "free"
              ? `${tuitions.length} / ${maxFreePosts}`
              : tuitions.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {plan === "free"
              ? "Free plan allows up to 2 listings"
              : "Unlimited listings enabled"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Applications
          </p>
          <p className="text-3xl font-extrabold text-indigo-600 mt-2">
            {totalApplicants}
          </p>
          <p className="text-xs text-slate-500 mt-1">Requests from students</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Accepted Students
          </p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">
            {acceptedStudents}
          </p>
          <p className="text-xs text-slate-500 mt-1">Enrolled in your batches</p>
        </div>
      </div>

      {/* Free Limit / Pro Upgrade Notice */}
      {isLimitReached && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Free Posting Limit Reached
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              You have used all {maxFreePosts} free tuition listings.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Upgrade to Pro Tutor Plan ($15) with Stripe to unlock unlimited
              tuition posts and a verified badge.
            </p>
          </div>
          <Link
            href="/pricing"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shrink-0 text-center transition"
          >
            Upgrade to Pro ($15)
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
          <p className="text-xs font-medium text-slate-500">
            Loading your tuitions and applications...
          </p>
        </div>
      ) : (
        <>
          {/* My Tuitions Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                My Tuition Batches
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {tuitions.length} listings
              </span>
            </div>

            {tuitions.length === 0 ? (
              <div className="text-center py-12 px-6 space-y-2">
                <p className="text-sm font-bold text-slate-800">
                  No tuition batches posted yet.
                </p>
                <p className="text-xs text-slate-500">
                  Click &ldquo;Post New Tuition&rdquo; above to create your first
                  listing.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-6">Title & Subject</th>
                      <th className="py-3.5 px-6">Class & Mode</th>
                      <th className="py-3.5 px-6">Monthly Fee</th>
                      <th className="py-3.5 px-6">Applicants</th>
                      <th className="py-3.5 px-6">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {tuitions.map((t) => {
                      const modStatus =
                        t.approvalStatus || t.status || "Pending";
                      const isApproved = modStatus === "Approved";
                      const appCount =
                        typeof t.applicantsCount === "number"
                          ? t.applicantsCount
                          : applications.filter((a) => {
                              const refId =
                                typeof a.tuitionId === "object"
                                  ? a.tuitionId?._id
                                  : a.tuitionId;
                              return refId === t._id;
                            }).length;

                      return (
                        <tr
                          key={t._id}
                          className="hover:bg-slate-50/70 transition"
                        >
                          <td className="py-4 px-6">
                            <Link
                              href={`/tuitions/${t._id}`}
                              className="font-bold text-slate-900 hover:text-indigo-600 transition"
                            >
                              {t.title}
                            </Link>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {t.subject}
                            </p>
                          </td>
                          <td className="py-4 px-6 text-xs font-semibold text-slate-700">
                            {t.classLevel} • {t.mode}
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900">
                            ${t.monthlyFee}/mo
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                              <Users className="w-3.5 h-3.5" /> {appCount}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                isApproved
                                  ? "bg-emerald-100 text-emerald-700"
                                  : modStatus === "Rejected"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {isApproved ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              ) : modStatus === "Rejected" ? (
                                <XCircle className="w-3.5 h-3.5" />
                              ) : (
                                <Clock className="w-3.5 h-3.5" />
                              )}
                              {modStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Incoming Student Applications */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                Student Applications
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {applications.length} requests
              </span>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-12 px-6">
                <p className="text-sm font-bold text-slate-800">
                  No student applications received yet.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Once students apply to your approved tuitions, they will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {applications.map((app) => {
                  const studentObj =
                    typeof app.studentId === "object" && app.studentId !== null
                      ? app.studentId
                      : null;
                  const tuitionObj =
                    typeof app.tuitionId === "object" && app.tuitionId !== null
                      ? app.tuitionId
                      : null;

                  const studentName =
                    app.studentName || studentObj?.name || "Student";
                  const studentEmail =
                    app.studentEmail || studentObj?.email || "";
                  const phone = app.phone || studentObj?.phone || "";
                  const tuitionTitle =
                    app.tuitionTitle || tuitionObj?.title || "Tuition Batch";
                  const isPriority =
                    Boolean(app.isPriority) || studentObj?.plan === "pro";

                  return (
                    <div
                      key={app._id}
                      className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/60 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">
                            {studentName}
                          </h4>
                          {isPriority && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                              <Sparkles className="w-3 h-3" /> Priority Student
                            </span>
                          )}
                          {(studentEmail || phone) && (
                            <>
                              <span className="text-xs text-slate-400">•</span>
                              <span className="text-xs text-slate-500">
                                {[studentEmail, phone]
                                  .filter(Boolean)
                                  .join(" • ")}
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-indigo-600">
                          Tuition: {tuitionTitle}
                        </p>
                        <p className="text-xs text-slate-600">
                          Schedule: <strong>{app.preferredSchedule}</strong>
                          {app.note ? ` — "${app.note}"` : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {app.status === "Pending" ? (
                          <>
                            <button
                              type="button"
                              disabled={updatingId === app._id}
                              onClick={() =>
                                handleStatusChange(app._id, "Accepted")
                              }
                              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white transition"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                            </button>
                            <button
                              type="button"
                              disabled={updatingId === app._id}
                              onClick={() =>
                                handleStatusChange(app._id, "Rejected")
                              }
                              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 disabled:opacity-60 text-rose-700 border border-rose-200 transition"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                              app.status === "Accepted"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {app.status === "Accepted" ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            {app.status}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}