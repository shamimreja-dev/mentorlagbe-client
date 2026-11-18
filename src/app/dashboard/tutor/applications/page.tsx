"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  Calendar,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export default function TutorApplicationsPage() {
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Pending" | "Accepted" | "Rejected"
  >("All");

  const [applications, setApplications] = useState([
    {
      id: "app-101",
      studentName: "Nabila Rahman",
      studentEmail: "nabila@gmail.com",
      phone: "+8801711000001",
      tuitionTitle: "HSC Higher Math & Physics 1-on-1 Mentorship",
      preferredSchedule: "Evening (4 PM - 6 PM)",
      note: "Need extra focus on calculus and vectors.",
      appliedAt: "2026-11-15",
      status: "Pending" as "Pending" | "Accepted" | "Rejected",
    },
    {
      id: "app-102",
      studentName: "Mahmudul Hasan",
      studentEmail: "mahmud@gmail.com",
      phone: "+8801811000002",
      tuitionTitle: "IELTS Academic Band 8+ Masterclass",
      preferredSchedule: "Morning (9 AM - 10:30 AM)",
      note: "Targeting Band 8.0 within 2 months.",
      appliedAt: "2026-11-14",
      status: "Pending" as "Pending" | "Accepted" | "Rejected",
    },
    {
      id: "app-103",
      studentName: "Tasnim Akter",
      studentEmail: "tasnim@gmail.com",
      phone: "+8801911000003",
      tuitionTitle: "HSC Higher Math & Physics 1-on-1 Mentorship",
      preferredSchedule: "Evening (4 PM - 6 PM)",
      note: "Looking for structured weekly tests.",
      appliedAt: "2026-11-11",
      status: "Accepted" as "Pending" | "Accepted" | "Rejected",
    },
    {
      id: "app-104",
      studentName: "Rashedul Karim",
      studentEmail: "rashed@gmail.com",
      phone: "+8801611000004",
      tuitionTitle: "IELTS Academic Band 8+ Masterclass",
      preferredSchedule: "Night (9 PM - 10:30 PM)",
      note: "Want weekend speaking practice only.",
      appliedAt: "2026-11-08",
      status: "Rejected" as "Pending" | "Accepted" | "Rejected",
    },
  ]);

  const handleUpdateStatus = (
    id: string,
    newStatus: "Accepted" | "Rejected"
  ) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    toast.success(`Application ${newStatus.toLowerCase()}!`);
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
      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-base font-extrabold text-slate-900">
                    {app.studentName}
                  </h3>
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
                  <span className="text-xs text-slate-400">
                    Applied on {app.appliedAt}
                  </span>
                </div>

                <p className="text-xs font-bold text-indigo-600">
                  Tuition: {app.tuitionTitle}
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-1">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {app.studentEmail}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {app.phone}
                  </span>
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
                      onClick={() => handleUpdateStatus(app.id, "Accepted")}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(app.id, "Rejected")}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
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
          ))
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">
            No applications found for &ldquo;{statusFilter}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}