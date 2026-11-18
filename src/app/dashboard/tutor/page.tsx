"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

export default function TutorDashboardPage() {
  // ডেমো টিউটর প্ল্যান ('free' | 'pro')
  // Free প্ল্যানে লিমিট ২টি পোস্ট, Pro প্ল্যানে আনলিমিটেড
  const plan: "free" | "pro" = "free";
  const maxFreePosts = 2;

  const [tuitions] = useState([
    {
      id: "1",
      title: "HSC Higher Math & Physics 1-on-1 Mentorship",
      subject: "Higher Mathematics",
      classLevel: "HSC (Class 11-12)",
      mode: "Online",
      monthlyFee: 35,
      approvalStatus: "Approved",
      applicantsCount: 6,
    },
    {
      id: "4",
      title: "IELTS Academic Band 8+ Masterclass",
      subject: "IELTS & English",
      classLevel: "College / Admission",
      mode: "Online",
      monthlyFee: 40,
      approvalStatus: "Pending",
      applicantsCount: 3,
    },
  ]);

  const [applications, setApplications] = useState([
    {
      id: "req-1",
      studentName: "Nabila Rahman",
      studentEmail: "nabila@gmail.com",
      phone: "+8801711000001",
      tuitionTitle: "HSC Higher Math & Physics 1-on-1 Mentorship",
      preferredSchedule: "Evening (4 PM - 6 PM)",
      note: "Need extra focus on calculus and vectors.",
      status: "Pending" as "Pending" | "Accepted" | "Rejected",
    },
    {
      id: "req-2",
      studentName: "Mahmudul Hasan",
      studentEmail: "mahmud@gmail.com",
      phone: "+8801811000002",
      tuitionTitle: "IELTS Academic Band 8+ Masterclass",
      preferredSchedule: "Morning (9 AM - 10:30 AM)",
      note: "Targeting Band 8.0 within 2 months.",
      status: "Pending" as "Pending" | "Accepted" | "Rejected",
    },
    {
      id: "req-3",
      studentName: "Tasnim Akter",
      studentEmail: "tasnim@gmail.com",
      phone: "+8801911000003",
      tuitionTitle: "HSC Higher Math & Physics 1-on-1 Mentorship",
      preferredSchedule: "Evening (4 PM - 6 PM)",
      note: "Looking for structured weekly tests.",
      status: "Accepted" as "Pending" | "Accepted" | "Rejected",
    },
  ]);

  const handleStatusChange = (
    appId: string,
    newStatus: "Accepted" | "Rejected"
  ) => {
    setApplications((prev) =>
      prev.map((item) =>
        item.id === appId ? { ...item, status: newStatus } : item
      )
    );
    toast.success(`Application marked as ${newStatus}!`);
  };

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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Tutor Dashboard
            </h1>
            {plan === "pro" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                <ShieldCheck className="w-3.5 h-3.5" /> Pro Tutor
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage your tuition batches, posting limits, and incoming student applications.
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
              Upgrade to Pro Tutor Plan ($15) with Stripe to unlock unlimited tuition posts and a verified badge.
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
              {tuitions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-4 px-6">
                    <Link
                      href={`/tuitions/${t.id}`}
                      className="font-bold text-slate-900 hover:text-indigo-600 transition"
                    >
                      {t.title}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">{t.subject}</p>
                  </td>
                  <td className="py-4 px-6 text-xs font-semibold text-slate-700">
                    {t.classLevel} • {t.mode}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    ${t.monthlyFee}/mo
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full">
                      <Users className="w-3.5 h-3.5" /> {t.applicantsCount}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        t.approvalStatus === "Approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {t.approvalStatus === "Approved" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {t.approvalStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

        <div className="divide-y divide-slate-100">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-50/60 transition"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {app.studentName}
                  </h4>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs text-slate-500">
                    {app.studentEmail} • {app.phone}
                  </span>
                </div>
                <p className="text-xs font-semibold text-indigo-600">
                  Tuition: {app.tuitionTitle}
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
                      onClick={() => handleStatusChange(app.id, "Accepted")}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(app.id, "Rejected")}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition"
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
          ))}
        </div>
      </div>
    </div>
  );
}