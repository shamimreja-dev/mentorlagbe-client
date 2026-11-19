"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  Calendar,
  FileText,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest, authStorage } from "@/lib/api";

interface PopulatedStudentInfo {
  _id?: string;
  name?: string;
  email?: string;
  phone?: string;
  plan?: "free" | "pro";
}

interface PopulatedTuitionInfo {
  _id?: string;
  title?: string;
}

interface TutorApplicationItem {
  _id: string;
  tuitionId: string | PopulatedTuitionInfo;
  tuitionTitle?: string;
  studentId?: string | PopulatedStudentInfo;
  studentName?: string;
  studentEmail?: string;
  phone?: string;
  preferredSchedule: string;
  note?: string;
  isPriority?: boolean;
  createdAt?: string;
  status: "Pending" | "Accepted" | "Rejected";
}

export default function TutorApplicationsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Accepted" | "Rejected"
  >("All");
  const [applications, setApplications] = useState<TutorApplicationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncomingApplications = async () => {
      if (!authStorage.getToken()) {
        setIsLoading(false);
        router.push("/sign-in");
        return;
      }

      setIsLoading(true);
      try {
        const res = await apiRequest<{
          success: boolean;
          applications: TutorApplicationItem[];
        }>("/applications/tutor/incoming", {
          auth: true,
        });

        setApplications(res.applications || []);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load student applications.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncomingApplications();
  }, [router]);

  const handleUpdateStatus = async (
    id: string,
    newStatus: "Accepted" | "Rejected"
  ) => {
    setUpdatingId(id);
    try {
      const res = await apiRequest<{
        success: boolean;
        message?: string;
        application?: TutorApplicationItem;
      }>(`/applications/${id}/status`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status: newStatus }),
      });

      setApplications((prev) =>
        prev.map((app) =>
          app._id === id
            ? { ...app, status: res.application?.status || newStatus }
            : app
        )
      );
      toast.success(
        res.message || `Application ${newStatus.toLowerCase()}!`
      );
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

  const filteredApplications = applications.filter((app) =>
    statusFilter === "All" ? true : app.status === statusFilter
  );

  return (
    <div className="space-y-8">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Student Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review incoming student requests, preferred schedules, and notes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
          {(["All", "Pending", "Accepted", "Rejected"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === tab
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Cards */}
      {isLoading ? (
        <div className="bg-white p-14 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
          <p className="text-xs font-medium text-slate-500">
            Loading student applications...
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => {
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
              const formattedDate = app.createdAt
                ? new Date(app.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "";

              return (
                <div
                  key={app._id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-base font-extrabold text-slate-900">
                        {studentName}
                      </h3>
                      {isPriority && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800">
                          <Sparkles className="w-3 h-3" /> Priority
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          app.status === "Accepted"
                            ? "bg-emerald-100 text-emerald-700"
                            : app.status === "Rejected"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {app.status === "Accepted" ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : app.status === "Rejected" ? (
                          <XCircle className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {app.status}
                      </span>
                      {formattedDate && (
                        <span className="text-xs text-slate-400">
                          Applied on {formattedDate}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-bold text-indigo-600">
                      Tuition: {tuitionTitle}
                    </p>

                    <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1">
                      {studentEmail && (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {studentEmail}
                        </span>
                      )}
                      {phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {phone}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        {app.preferredSchedule}
                      </span>
                    </div>

                    {app.note && (
                      <p className="text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-start gap-2 mt-2">
                        <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{app.note}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {app.status === "Pending" ? (
                      <>
                        <button
                          type="button"
                          disabled={updatingId === app._id}
                          onClick={() =>
                            handleUpdateStatus(app._id, "Accepted")
                          }
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white transition"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Accept
                        </button>
                        <button
                          type="button"
                          disabled={updatingId === app._id}
                          onClick={() =>
                            handleUpdateStatus(app._id, "Rejected")
                          }
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 disabled:opacity-60 text-rose-700 border border-rose-200 transition"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Decision Recorded
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">
              No applications found for &ldquo;{statusFilter}&rdquo;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}