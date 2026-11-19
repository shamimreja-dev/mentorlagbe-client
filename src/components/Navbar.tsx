"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCog,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authStorage, AuthUser } from "@/lib/api";

const DEFAULT_AVATAR = "https://i.ibb.co.com/5GzXkwq/user.png";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Tuitions", href: "/tuitions" },
    { name: "Pricing", href: "/pricing" },
    { name: "How It Works", href: "/#how-it-works" },
  ];

  const isActive = (path: string) => pathname === path;

  const handleSignOut = () => {
    authStorage.clearSession();
    setUser(null);
    setMobileMenuOpen(false);
    toast.success("Signed out successfully!");
    router.push("/sign-in");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-indigo-600 p-2 rounded-xl text-white group-hover:bg-indigo-700 transition">
            <BookOpen className="w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Mentor<span className="text-indigo-600">Lagbe</span>
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
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth / User Profile State */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Role Badge */}
              <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                {user.role}
              </span>

              {/* Dashboard Link */}
              <Link
                href={`/dashboard/${user.role}`}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                Dashboard
              </Link>

              {/* Update Profile Link */}
              <Link
                href="/dashboard/profile"
                title="Update Profile"
                className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
              >
                <UserCog className="w-5 h-5" />
              </Link>

              {/* Avatar & Name */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <img
                  src={DEFAULT_AVATAR}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-indigo-200"
                />
                <span className="text-sm font-semibold text-slate-800 max-w-[110px] truncate">
                  {user.name}
                </span>
              </div>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleSignOut}
                title="Sign Out"
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition"
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

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-slate-700 hover:text-indigo-600"
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-slate-200" />
          {user ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <img
                  src={DEFAULT_AVATAR}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-slate-900">{user.name}</p>
                  <span className="text-xs font-bold uppercase text-indigo-600">
                    {user.role}
                  </span>
                </div>
              </div>
              <Link
                href={`/dashboard/${user.role}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 bg-indigo-600 text-white font-semibold rounded-lg"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 bg-slate-100 text-slate-800 font-semibold rounded-lg"
              >
                Update Profile
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full py-2.5 bg-rose-50 text-rose-600 font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 border border-slate-300 rounded-lg font-semibold text-slate-700"
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