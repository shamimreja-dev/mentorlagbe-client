"use client";

import { useEffect, useState } from "react";
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
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  Loader2,
} from "lucide-react";
import { authStorage, AuthUser, UserRole } from "@/lib/api";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const syncSession = () => {
      const current = authStorage.getUser();
      const token = authStorage.getToken();

      if (!current || !token) {
        setUser(null);
        setIsCheckingAuth(false);
        router.replace("/sign-in");
        return;
      }

      setUser(current);
      setIsCheckingAuth(false);
    };

    syncSession();
    window.addEventListener("mentorlagbe-auth-change", syncSession);
    return () => {
      window.removeEventListener("mentorlagbe-auth-change", syncSession);
    };
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <Loader2 className="w-9 h-9 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const role: UserRole = user.role || "student";
  const plan = user.plan || "free";
  const initials = (user.name || "ML")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/75 z-30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ${
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
              <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Mentor
                <span className="text-indigo-600 dark:text-indigo-400">
                  Lagbe
                </span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info Card */}
          <div className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                <ShieldCheck className="w-3 h-3" /> {role}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                  plan === "pro"
                    ? "bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                }`}
              >
                <Sparkles className="w-3 h-3" /> {plan}
              </span>
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
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Preferences */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
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
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 transition-colors">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white capitalize">
              {role} Workspace
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {plan !== "pro" && role !== "admin" && (
              <Link
                href="/pricing"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950 transition"
              >
                Upgrade Plan
              </Link>
            )}
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden md:inline">
              {user.email}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}