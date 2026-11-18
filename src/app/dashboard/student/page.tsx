"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function StudentDashboardPage() {
  // ডেমো অ্যাপ্লিকেশন ডেটা
  const [applications] = useState([
    {
      id: "app-1",
      tuitionId: "1",
      tuitionTitle: "HSC Higher Math & Physics 1-on-1 Mentorship",
      subject: "Higher Mathematics",
      mode: "Online",
      location: "Online via Zoom / Google Meet",
      monthlyFee: 35,
      preferredSchedule: "Evening (4 PM - 6 PM)",
      status: "Accepted" as "Pending" | "Accepted" | "Rejected",
      appliedAt: "2026-11-10",
    },
    {
      id: "app-2",
      tuitionId: "3",
      tuitionTitle: "Full-Stack Web Development with Next.js",
      subject: "Programming",
      mode: "Online",
      location: "Online via Google Meet",
      monthlyFee: 60,
      preferredSchedule: "Night (9 PM - 10:30 PM)",
      status: "Pending" as "Pending" | "Accepted" | "Rejected",
      appliedAt: "2026-11-14",
    },
    {
      id: "app-3",
      tuitionId: "2",
      tuitionTitle: "O-Level Physics & Chemistry Intensive Batch",
      subject: "Physics",
      mode: "Offline",
      location: "Dhanmondi, Dhaka",
      monthlyFee: 50,
      preferredSchedule: "Afternoon (3 PM - 4:30 PM)",
      status: "Rejected" as "Pending" | "Accepted" | "Rejected",
      appliedAt: "2026-11-05",
    },
  ]);

  const totalCount = applications.length;
  const acceptedCount = applications.filter((a) => a.status === "Accepted").length;
  const pendingCount = applications.filter((a) => a.status === "Pending").length;

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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Student Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your tuition applications, schedules, and enrollment statuses.
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
          <p className="text-xs text-slate-500 mt-1">Submitted tuition requests</p>
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
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" /> Priority Booking
          </span>
          <h2 className="text-lg font-extrabold">
            Want faster tutor responses and priority batch booking?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100">
            Upgrade to Pro anytime via Stripe and stand out on every tuition application.
          </p>
        </div>
        <Link
          href="/pricing"
          className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-sm rounded-xl shrink-0 text-center transition"
        >
          View Pro Plans
        </Link>
      </div>

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
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-900">{app.tuitionTitle}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {app.subject} • Applied {app.appliedAt}
                    </p>
                  </td>
                  <td className="py-4 px-6 space-y-1">
                    <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      {app.mode} — {app.location}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {app.preferredSchedule}
                    </p>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    ${app.monthlyFee}/mo
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(app.status)}</td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      href={`/tuitions/${app.tuitionId}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                    >
                      View Tuition <BookOpen className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}