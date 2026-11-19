"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  GraduationCap,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest, authStorage } from "@/lib/api";

interface AdminStats {
  totalUsers: number;
  totalTutors: number;
  pendingTuitions: number;
  totalRevenue: number;
}

interface PendingTuitionItem {
  _id: string;
  title: string;
  tutorName: string;
  subject: string;
  mode: "Online" | "Offline";
  monthlyFee: number;
  status?: "Pending" | "Approved" | "Rejected";
  approvalStatus?: "Pending" | "Approved" | "Rejected";
}

interface AdminUserItem {
  _id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "admin";
  plan: "free" | "pro";
}

interface AdminTransactionItem {
  _id: string;
  userName?: string;
  userId?: { name?: string; email?: string };
  planName?: string;
  amount: number;
  status: string;
  createdAt?: string;
  date?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTutors: 0,
    pendingTuitions: 0,
    totalRevenue: 0,
  });
  const [pendingTuitions, setPendingTuitions] = useState<PendingTuitionItem[]>(
    []
  );
  const [recentUsers, setRecentUsers] = useState<AdminUserItem[]>([]);
  const [transactions, setTransactions] = useState<AdminTransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moderatingId, setModeratingId] = useState<string | null>(null);

  useEffect(() => {
    const loadAdminDashboard = async () => {
      if (!authStorage.getToken()) {
        setIsLoading(false);
        router.push("/sign-in");
        return;
      }

      setIsLoading(true);
      try {
        const [statsRes, tuitionsRes, usersRes, txnsRes] = await Promise.all([
          apiRequest<{ success: boolean; stats?: AdminStats } & Partial<AdminStats>>(
            "/admin/stats",
            { auth: true }
          ),
          apiRequest<{ success: boolean; tuitions?: PendingTuitionItem[] }>(
            "/tuitions?status=Pending",
            { auth: true }
          ),
          apiRequest<{ success: boolean; users?: AdminUserItem[] }>(
            "/admin/users",
            { auth: true }
          ),
          apiRequest<{
            success: boolean;
            transactions?: AdminTransactionItem[];
          }>("/admin/transactions", { auth: true }),
        ]);

        const loadedStats: AdminStats = statsRes.stats || {
          totalUsers: statsRes.totalUsers ?? 0,
          totalTutors: statsRes.totalTutors ?? 0,
          pendingTuitions: statsRes.pendingTuitions ?? 0,
          totalRevenue: statsRes.totalRevenue ?? 0,
        };

        const loadedPending = (tuitionsRes.tuitions || []).filter(
          (t) => (t.status || t.approvalStatus || "Pending") === "Pending"
        );

        setStats({
          ...loadedStats,
          pendingTuitions:
            loadedStats.pendingTuitions || loadedPending.length,
        });
        setPendingTuitions(loadedPending);
        setRecentUsers((usersRes.users || []).slice(0, 6));
        setTransactions((txnsRes.transactions || []).slice(0, 6));
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load admin dashboard data.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminDashboard();
  }, [router]);

  const handleModerateTuition = async (
    id: string,
    decision: "Approved" | "Rejected"
  ) => {
    setModeratingId(id);
    try {
      const res = await apiRequest<{
        success: boolean;
        message?: string;
      }>(`/admin/tuitions/${id}/status`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status: decision }),
      });

      setPendingTuitions((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: decision } : item
        )
      );
      setStats((prev) => ({
        ...prev,
        pendingTuitions: Math.max(0, prev.pendingTuitions - 1),
      }));

      toast.success(res.message || `Tuition ${decision.toLowerCase()} successfully!`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to moderate tuition.";
      toast.error(message);
    } finally {
      setModeratingId(null);
    }
  };

  const activePendingCount = pendingTuitions.filter(
    (t) => (t.status || t.approvalStatus || "Pending") === "Pending"
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            System Administration
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Platform metrics, tuition moderation queue, user roles, and Stripe
            revenue overview.
          </p>
        </div>

        <Link
          href="/tuitions"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-sm transition"
        >
          View Live Tuitions <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Users
            </p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              {stats.totalUsers}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Registered students & mentors
            </p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Tutors
            </p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              {stats.totalTutors}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Active subject mentors
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Tuitions
            </p>
            <p className="text-3xl font-extrabold text-amber-600 mt-2">
              {stats.pendingTuitions}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Awaiting moderation checks
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Revenue
            </p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              ${stats.totalRevenue}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Stripe subscription volume
            </p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white p-14 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
          <p className="text-xs font-medium text-slate-500">
            Loading platform administration data...
          </p>
        </div>
      ) : (
        <>
          {/* Tuition Moderation Queue */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                Tuition Moderation Queue
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {activePendingCount} pending
              </span>
            </div>

            {pendingTuitions.length === 0 ? (
              <div className="p-10 text-center text-sm text-slate-500">
                No pending tuitions waiting for moderation right now.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingTuitions.map((item) => {
                  const currentStatus =
                    item.status || item.approvalStatus || "Pending";

                  return (
                    <div
                      key={item._id}
                      className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition"
                    >
                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                          Tutor:{" "}
                          <strong className="text-slate-700">
                            {item.tutorName}
                          </strong>{" "}
                          • {item.subject} • {item.mode} •{" "}
                          <strong className="text-indigo-600">
                            ${item.monthlyFee}/mo
                          </strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {currentStatus === "Pending" ? (
                          <>
                            <button
                              type="button"
                              disabled={moderatingId === item._id}
                              onClick={() =>
                                handleModerateTuition(item._id, "Approved")
                              }
                              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white transition"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              type="button"
                              disabled={moderatingId === item._id}
                              onClick={() =>
                                handleModerateTuition(item._id, "Rejected")
                              }
                              className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 disabled:opacity-60 text-rose-700 border border-rose-200 transition"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Reject
                            </button>
                          </>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                              currentStatus === "Approved"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {currentStatus}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom 2-Column Grid: Users & Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Users */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" /> Users &
                  Plans
                </h3>
                <Link
                  href="/dashboard/admin/users"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  View All ({recentUsers.length})
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {recentUsers.map((u) => (
                  <div
                    key={u._id}
                    className="px-6 py-4 flex items-center justify-between gap-4 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">
                        {u.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {u.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-slate-100 text-slate-700">
                        {u.role}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                          u.plan === "pro"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {u.plan}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" /> Stripe
                  Transactions
                </h3>
                <Link
                  href="/dashboard/admin/transactions"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  View All ({transactions.length})
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {transactions.length === 0 ? (
                  <div className="px-6 py-10 text-center text-xs text-slate-500">
                    No Stripe transactions recorded yet.
                  </div>
                ) : (
                  transactions.map((txn) => {
                    const displayUser =
                      txn.userName || txn.userId?.name || "Member";
                    const displayDate = txn.date
                      ? txn.date
                      : txn.createdAt
                        ? new Date(txn.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "";

                    return (
                      <div
                        key={txn._id}
                        className="px-6 py-4 flex items-center justify-between gap-4 text-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 truncate">
                            {displayUser}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {txn.planName || "Pro Subscription"}
                            {displayDate ? ` • ${displayDate}` : ""}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-extrabold text-emerald-600">
                            ${txn.amount}
                          </p>
                          <span className="text-[11px] font-bold text-slate-400">
                            {txn.status}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}