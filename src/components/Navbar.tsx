"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authStorage, AuthUser } from "@/lib/api";

const DEFAULT_AVATAR = "https://i.ibb.co.com/5GzXkwq/user.png";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isDark, setIsDark] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncUser = () => {
      setUser(authStorage.getUser());
    };

    syncUser();
    window.addEventListener("mentorlagbe-auth-change", syncUser);
    return () => {
      window.removeEventListener("mentorlagbe-auth-change", syncUser);
    };
  }, []);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("mentorlagbe-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme ? savedTheme === "dark" : prefersDark;

    document.documentElement.classList.toggle("dark", shouldBeDark);
    setIsDark(shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    document.documentElement.classList.toggle("dark", nextDark);
    localStorage.setItem("mentorlagbe-theme", nextDark ? "dark" : "light");
    setIsDark(nextDark);
  };

  useEffect(() => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileMenuOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Tuitions", href: "/tuitions" },
    { name: "Pricing", href: "/pricing" },
    { name: "How It Works", href: "/#how-it-works" },
  ];

  const isActive = (path: string) => pathname === path;

  const getDashboardHref = (role?: string) => {
    if (role === "student" || role === "tutor" || role === "admin") {
      return `/dashboard/${role}`;
    }
    return "/dashboard";
  };

  const handleSignOut = () => {
    authStorage.clearSession();
    setUser(null);
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    toast.success("Signed out successfully!");
    router.push("/sign-in");
  };

  const avatarSrc =
    (user as (AuthUser & { image?: string }) | null)?.image || DEFAULT_AVATAR;

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:bg-indigo-700 transition">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Mentor<span className="text-indigo-600 dark:text-indigo-400">Lagbe</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-semibold transition ${
                isActive(link.href)
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Theme Toggle + Auth / User Profile Dropdown */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                aria-expanded={profileMenuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition shadow-2xs"
              >
                <img
                  src={avatarSrc}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-indigo-200 dark:border-indigo-500/40"
                />
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 max-w-[130px] truncate leading-tight">
                    {user.name}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 leading-none">
                    {user.role}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg py-2 z-50"
                >
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    {user.email && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {user.email}
                      </p>
                    )}
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {user.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard/profile"
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    >
                      <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      Update Profile
                    </Link>

                    <Link
                      href={getDashboardHref(user.role)}
                      role="menuitem"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    >
                      <LayoutDashboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Dashboard
                    </Link>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-700 pt-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Theme Toggle + Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-slate-200 dark:border-slate-800" />
          {user ? (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 pb-1">
                <img
                  src={avatarSrc}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {user.name}
                  </p>
                  {user.email && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </p>
                  )}
                  <span className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400">
                    {user.role}
                  </span>
                </div>
              </div>
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold rounded-lg"
              >
                Update Profile
              </Link>
              <Link
                href={getDashboardHref(user.role)}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 bg-indigo-600 text-white font-semibold rounded-lg"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg font-semibold text-slate-700 dark:text-slate-200"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 bg-indigo-600 text-white rounded-lg font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}