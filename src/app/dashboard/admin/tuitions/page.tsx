"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  ExternalLink,
  Search,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest, authStorage } from "@/lib/api";

type TuitionStatus = "Pending" | "Approved" | "Rejected";

interface TuitionListing {
  _id: string;
  title: string;
  tutorName: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  monthlyFee: number;
  status?: TuitionStatus;
  approvalStatus?: TuitionStatus;
}

export default function AdminTuitionsPage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TuitionStatus>("All");
  const [tuitions, setTuitions] = useState<TuitionListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllTuitions = async () => {
      if (!authStorage.getToken()) {
        setIsLoading(false);
        router.push("/sign-in");
        return;
      }

      setIsLoading(true);
      try {
        const res = await apiRequest<{
          success: boolean;
          tuitions: TuitionListing[];
        }>("/tuitions?status=All", {
          auth: true,
        });

        setTuitions(res.tuitions || []);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load tuitions.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllTuitions();
  }, [router]);

  const handleStatusChange = async (id: string, newStatus: TuitionStatus) => {
    setActionId(id);
    try {
      const res = await apiRequest<{
        success: boolean;
        message?: string;
        tuition?: TuitionListing;
      }>(`/admin/tuitions/${id}/status`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status: newStatus }),
      });

      setTuitions((prev) =>
        prev.map((t) =>
          t._id === id
            ? {
                ...t,
                status: res.tuition?.status || newStatus,
                approvalStatus: res.tuition?.approvalStatus || newStatus,
              }
            : t
        )
      );
      toast.success(res.message || `Tuition status set to ${newStatus}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update tuition status.";
      toast.error(message);
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteTuition = async (id: string, title: string) => {
    setActionId(id);
    try {
      const res = await apiRequest<{ success: boolean; message?: string }>(
        `/tuitions/${id}`,
        {
          method: "DELETE",
          auth: true,
        }
      );

      setTuitions((prev) => prev.filter((t) => t._id !== id));
      toast.success(res.message || `Deleted "${title}"`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete tuition.";
      toast.error(message);
    } finally {
      setActionId(null);
    }
  };

  const getTuitionStatus = (t: TuitionListing): TuitionStatus =>
    t.status || t.approvalStatus || "Pending";

  const filteredTuitions = tuitions.filter((t) => {
    const currentStatus = getTuitionStatus(t);
    const matchesStatus = statusFilter === "All" || currentStatus === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      t.title.toLowerCase().includes(q) ||
      t.tutorName.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getBadge = (status: TuitionStatus) => {
    if (status === "Approved") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5" /> Approved
        </span>
      );
    }
    if (status === "Rejected") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
          <XCircle className="w-3.5 h-3.5" /> Rejected
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
        <Clock className="w-3.5 h-3.5" /> Pending
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Tuitions Moderation
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Approve or reject tutor-submitted batches before they go live for
          students.
        </p>
      </div>

      {/* Search & Status Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search tuition title, tutor, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start">
          {(["All", "Pending", "Approved", "Rejected"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                statusFilter === tab
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tuitions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-16 px-6 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
            <p className="text-xs font-medium text-slate-500">
              Loading tuitions for moderation...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-6">Tuition & Tutor</th>
                  <th className="py-3.5 px-6">Subject & Mode</th>
                  <th className="py-3.5 px-6">Fee</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTuitions.length > 0 ? (
                  filteredTuitions.map((t) => {
                    const currentStatus = getTuitionStatus(t);
                    const isBusy = actionId === t._id;

                    return (
                      <tr
                        key={t._id}
                        className="hover:bg-slate-50/70 transition"
                      >
                        <td className="py-4 px-6">
                          <Link
                            href={`/tuitions/${t._id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 inline-flex items-center gap-1 transition"
                          >
                            <span>{t.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                          </Link>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Tutor: {t.tutorName} • {t.classLevel}
                          </p>
                        </td>
                        <td className="py-4 px-6 text-xs font-semibold text-slate-700">
                          {t.subject} • {t.mode}
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-900">
                          ${t.monthlyFee}/mo
                        </td>
                        <td className="py-4 px-6">{getBadge(currentStatus)}</td>
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            {currentStatus !== "Approved" && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() =>
                                  handleStatusChange(t._id, "Approved")
                                }
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white transition"
                              >
                                Approve
                              </button>
                            )}
                            {currentStatus !== "Rejected" && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() =>
                                  handleStatusChange(t._id, "Rejected")
                                }
                                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 disabled:opacity-60 text-amber-800 border border-amber-200 transition"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() =>
                                handleDeleteTuition(t._id, t.title)
                              }
                              className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-60 transition"
                              aria-label={`Delete ${t.title}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 px-6 text-center text-sm text-slate-500"
                    >
                      No tuitions found matching your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}