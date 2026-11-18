"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  UserCheck,
  GraduationCap,
  FilePlus2,
  ClipboardList,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ডেমো ইউজার ও রোল ('student' | 'tutor' | 'admin')
  // পরবর্তীতে auth session থেকে ডাইনামিক হবে
  const [role, setRole] = useState<"student" | "tutor" | "admin">("admin");
  const plan: "free" | "pro" = "pro";

  const currentUser = {
    name:
      role === "admin"
        ? "Admin User"
        : role === "tutor"
        ? "Prof. Tanvir Ahmed"
        : "Ariful Islam",
    email:
      role === "admin"
        ? "admin@mentorlagbe.com"
        : role === "tutor"
        ? "tutor@mentorlagbe.com"
        : "student@mentorlagbe.com",
  };

  const handleLogout = () => {
    toast.success("Signed out successfully!");
    router.push("/sign-in");
  };

  // রোল অনুযায়ী নেভিগেশন আইটেম
  const navItems =
    role === "admin"
      ? [
          {
            name: "Overview",
            href: "/dashboard/admin",
            icon: LayoutDashboard,
          },
          {
            name: "Users",
            href: "/dashboard/admin/users",
            icon: Users,
          },
          {
            name: "Tuitions",
            href: "/dashboard/admin/tuitions",
            icon: BookOpen,
          },
          {
            name: "Transactions",
            href: "/dashboard/admin/transactions",
            icon: CreditCard,
          },
        ]
      : role === "tutor"
      ? [
          {
            name: "My Tuitions",
            href: "/dashboard/tutor",
            icon: BookOpen,
          },
          {
            name: "Post Tuition",
            href: "/dashboard/tutor/create",
            icon: FilePlus2,
          },
          {
            name: "Applications",
            href: "/dashboard/tutor/applications",
            icon: ClipboardList,
          },
        ]
      : [
          {
            name: "My Applications",
            href: "/dashboard/student",
            icon: GraduationCap,
          },
          {
            name: "Browse Tuitions",
            href: "/tuitions",
            icon: BookOpen,
          },
        ];

  const commonItems = [
    {
      name: "Update Profile",
      href: "/dashboard/profile",
      icon: UserCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Top Brand + Mobile Close */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow">
                ML
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Mentor<span className="text-indigo-600">Lagbe</span>
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-indigo-100 text-indigo-700">
                <ShieldCheck className="w-3 h-3" /> {role}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                  plan === "pro"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                <Sparkles className="w-3 h-3" /> {plan}
              </span>
            </div>
          </div>

          {/* Quick Role Switcher for Testing Layout */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
              Preview Role View
            </p>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
              {(["student", "tutor", "admin"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                    role === r
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Main Menu */}
          <div className="space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Main Menu
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Preferences */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Preferences
            </p>
            {commonItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom Logout */}
        <div className="p-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 capitalize">
              {role} Workspace
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
            >
              Upgrade Plan
            </Link>
            <span className="text-xs font-semibold text-slate-500 hidden md:inline">
              {currentUser.email}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}