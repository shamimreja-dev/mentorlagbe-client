"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  ExternalLink,
  Search,
} from "lucide-react";
import { toast } from "sonner";

type TuitionStatus = "Pending" | "Approved" | "Rejected";

interface TuitionListing {
  id: string;
  title: string;
  tutorName: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  monthlyFee: number;
  status: TuitionStatus;
}

export default function AdminTuitionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TuitionStatus>("All");

  const [tuitions, setTuitions] = useState<TuitionListing[]>([
    {
      id: "1",
      title: "HSC Higher Math & Physics 1-on-1 Mentorship",
      tutorName: "Prof. Tanvir Ahmed",
      subject: "Higher Mathematics",
      classLevel: "HSC (Class 11-12)",
      mode: "Online",
      monthlyFee: 35,
      status: "Approved",
    },
    {
      id: "t-101",
      title: "HSC Higher Math Crash Course",
      tutorName: "Prof. Tanvir Ahmed",
      subject: "Higher Mathematics",
      classLevel: "HSC (Class 11-12)",
      mode: "Online",
      monthlyFee: 35,
      status: "Pending",
    },
    {
      id: "t-102",
      title: "Spoken English & Fluency Batch",
      tutorName: "Nusrat Jahan",
      subject: "IELTS & English",
      classLevel: "College / Admission",
      mode: "Offline",
      monthlyFee: 30,
      status: "Pending",
    },
    {
      id: "2",
      title: "O-Level Physics & Chemistry Intensive Batch",
      tutorName: "Dr. Farhana Rahman",
      subject: "Physics",
      classLevel: "O-Level",
      mode: "Offline",
      monthlyFee: 50,
      status: "Approved",
    },
    {
      id: "t-103",
      title: "Unverified Quick Test Prep",
      tutorName: "Sadia Sultana",
      subject: "Biology",
      classLevel: "Class 9-10",
      mode: "Online",
      monthlyFee: 20,
      status: "Rejected",
    },
  ]);

  const handleStatusChange = (id: string, newStatus: TuitionStatus) => {
    setTuitions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    toast.success(`Tuition status set to ${newStatus}`);
  };

  const handleDeleteTuition = (id: string, title: string) => {
    setTuitions((prev) => prev.filter((t) => t.id !== id));
    toast.success(`Deleted "${title}"`);
  };

  const filteredTuitions = tuitions.filter((t) => {
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
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
          Approve or reject tutor-submitted batches before they go live for students.
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
                filteredTuitions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <Link
                        href={`/tuitions/${t.id}`}
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
                    <td className="py-4 px-6">{getBadge(t.status)}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        {t.status !== "Approved" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(t.id, "Approved")}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition"
                          >
                            Approve
                          </button>
                        )}
                        {t.status !== "Rejected" && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(t.id, "Rejected")}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteTuition(t.id, t.title)}
                          className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
                          aria-label={`Delete ${t.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
      </div>
    </div>
  );
}