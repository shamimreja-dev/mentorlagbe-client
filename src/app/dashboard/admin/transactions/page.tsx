"use client";

import { useState } from "react";
import {
  CreditCard,
  DollarSign,
  CheckCircle2,
  Search,
  Download,
} from "lucide-react";
import { toast } from "sonner";

interface TransactionItem {
  id: string;
  sessionId: string;
  userName: string;
  userEmail: string;
  role: "student" | "tutor";
  planName: "Pro Tutor Plan" | "Pro Student Plan";
  amount: number;
  status: "Paid" | "Refunded";
  createdAt: string;
}

export default function AdminTransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const [transactions] = useState<TransactionItem[]>([
    {
      id: "tx-1",
      sessionId: "cs_test_a1b2c3d4e5",
      userName: "Prof. Tanvir Ahmed",
      userEmail: "tanvir.ahmed@gmail.com",
      role: "tutor",
      planName: "Pro Tutor Plan",
      amount: 15,
      status: "Paid",
      createdAt: "2026-11-18",
    },
    {
      id: "tx-2",
      sessionId: "cs_test_f6g7h8i9j0",
      userName: "Ariful Islam",
      userEmail: "ariful@gmail.com",
      role: "student",
      planName: "Pro Student Plan",
      amount: 10,
      status: "Paid",
      createdAt: "2026-11-16",
    },
    {
      id: "tx-3",
      sessionId: "cs_test_k1l2m3n4o5",
      userName: "Sadia Sultana",
      userEmail: "sadia.tutor@gmail.com",
      role: "tutor",
      planName: "Pro Tutor Plan",
      amount: 15,
      status: "Paid",
      createdAt: "2026-11-14",
    },
    {
      id: "tx-4",
      sessionId: "cs_test_p6q7r8s9t0",
      userName: "Nabila Rahman",
      userEmail: "nabila@gmail.com",
      role: "student",
      planName: "Pro Student Plan",
      amount: 10,
      status: "Paid",
      createdAt: "2026-11-10",
    },
  ]);

  const filteredTransactions = transactions.filter((txn) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      txn.userName.toLowerCase().includes(q) ||
      txn.userEmail.toLowerCase().includes(q) ||
      txn.planName.toLowerCase().includes(q) ||
      txn.sessionId.toLowerCase().includes(q)
    );
  });

  const totalPaidAmount = transactions
    .filter((t) => t.status === "Paid")
    .reduce((sum, t) => sum + t.amount, 0);

  const handleExportLog = () => {
    toast.success("Transaction summary exported!");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Stripe Transactions
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Audit Pro Plan upgrades ($15 Tutor / $10 Student) and payment history.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportLog}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs rounded-xl shadow-sm transition self-start"
        >
          <Download className="w-4 h-4 text-indigo-600" /> Export Summary
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Revenue
            </p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              ${totalPaidAmount}
            </p>
            <p className="text-xs text-slate-500 mt-1">Settled in USD ($)</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Completed Payments
            </p>
            <p className="text-3xl font-extrabold text-indigo-600 mt-2">
              {transactions.filter((t) => t.status === "Paid").length}
            </p>
            <p className="text-xs text-slate-500 mt-1">Verified Pro upgrades</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pro Tiers
            </p>
            <p className="text-lg font-extrabold text-slate-900 mt-2">
              $15 Tutor • $10 Student
            </p>
            <p className="text-xs text-slate-500 mt-1">One-time Stripe plans</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search user, email, plan, or Stripe session ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">User & Role</th>
                <th className="py-3.5 px-6">Plan & Session</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{txn.userName}</p>
                      <p className="text-xs text-slate-500">
                        {txn.userEmail} •{" "}
                        <span className="uppercase font-semibold">
                          {txn.role}
                        </span>
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs font-bold text-indigo-700">
                        {txn.planName}
                      </p>
                      <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {txn.sessionId}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600">
                      {txn.createdAt}
                    </td>
                    <td className="py-4 px-6 font-extrabold text-slate-900">
                      ${txn.amount}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {txn.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 px-6 text-center text-sm text-slate-500"
                  >
                    No transactions match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}