"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  useEffect(() => {
    toast.success("Welcome back, Admin User!");
  }, []);

  const [pendingTuitions, setPendingTuitions] = useState([
    {
      id: "t-101",
      title: "HSC Higher Math Crash Course",
      tutorName: "Prof. Tanvir Ahmed",
      subject: "Higher Mathematics",
      mode: "Online",
      monthlyFee: 35,
      status: "Pending" as "Pending" | "Approved" | "Rejected",
    },
    {
      id: "t-102",
      title: "Spoken English & Fluency Batch",
      tutorName: "Nusrat Jahan",
      subject: "IELTS & English",
      mode: "Offline",
      monthlyFee: 30,
      status: "Pending" as "Pending" | "Approved" | "Rejected",
    },
  ]);

  const [recentUsers] = useState([
    {
      id: "u-1",
      name: "Ariful Islam",
      email: "ariful@gmail.com",
      role: "student",
      plan: "pro",
    },
    {
      id: "u-2",
      name: "Prof. Tanvir Ahmed",
      email: "tanvir.ahmed@gmail.com",
      role: "tutor",
      plan: "pro",
    },
    {
      id: "u-3",
      name: "Nabila Rahman",
      email: "nabila@gmail.com",
      role: "student",
      plan: "free",
    },
  ]);

  const [transactions] = useState([
    {
      id: "txn-1",
      userName: "Prof. Tanvir Ahmed",
      planName: "Pro Tutor Plan",
      amount: 15,
      date: "2026-11-15",
      status: "Paid",
    },
    {
      id: "txn-2",
      userName: "Ariful Islam",
      planName: "Pro Student Plan",
      amount: 10,
      date: "2026-11-16",
      status: "Paid",
    },
    {
      id: "txn-3",
      userName: "Sadia Sultana",
      planName: "Pro Tutor Plan",
      amount: 15,
      date: "2026-11-18",
      status: "Paid",
    },
  ]);

  const handleModerateTuition = (
    id: string,
    decision: "Approved" | "Rejected"
  ) => {
    setPendingTuitions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: decision } : item))
    );
    toast.success(`Tuition ${decision.toLowerCase()} successfully!`);
  };

  const pendingCount = pendingTuitions.filter(
    (t) => t.status === "Pending"
  ).length;
  const totalRevenue = transactions.reduce((sum, txn) => sum + txn.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            System Administration
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Platform metrics, tuition moderation queue, user roles, and Stripe revenue overview.
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
            <p className="text-3xl font-extrabold text-slate-900 mt-2">36</p>
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
            <p className="text-3xl font-extrabold text-slate-900 mt-2">12</p>
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
              {pendingCount}
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
              ${totalRevenue}
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

      {/* Tuition Moderation Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">
            Tuition Moderation Queue
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {pendingCount} pending
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {pendingTuitions.map((item) => (
            <div
              key={item.id}
              className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition"
            >
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500">
                  Tutor: <strong className="text-slate-700">{item.tutorName}</strong> •{" "}
                  {item.subject} • {item.mode} •{" "}
                  <strong className="text-indigo-600">${item.monthlyFee}/mo</strong>
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {item.status === "Pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleModerateTuition(item.id, "Approved")}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleModerateTuition(item.id, "Rejected")}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                      item.status === "Approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 2-Column Grid: Users & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Users & Plans
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {recentUsers.length} shown
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {recentUsers.map((u) => (
              <div
                key={u.id}
                className="px-6 py-4 flex items-center justify-between gap-4 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{u.name}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
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
              <CreditCard className="w-4 h-4 text-indigo-600" /> Stripe Transactions
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {transactions.length} payments
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="px-6 py-4 flex items-center justify-between gap-4 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">
                    {txn.userName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {txn.planName} • {txn.date}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-extrabold text-emerald-600">${txn.amount}</p>
                  <span className="text-[11px] font-bold text-slate-400">
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}