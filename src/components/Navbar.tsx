"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  // টেম্পোরারি ইউজার স্টেট (পরে BetterAuth সেশন দিয়ে রিপ্লেস করবেন)
  const [user, setUser] = useState<{ name: string; role: 'student' | 'tutor' | 'admin'; image: string } | null>({
    name: "John Doe",
    role: "student",
    image: "https://i.ibb.co.com/7X7d7X7/placeholder.png"
  });

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              MentorLagbe
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link href="/tuitions" className="hover:text-blue-600 transition-colors">Browse Tuitions</Link>
            <Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">How It Works</Link>
          </div>

          {/* Right Side: Auth / User Profile */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-600 rounded-full border border-blue-200">
                  {user.role}
                </span>
                <div className="relative group">
                  <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-slate-100 transition">
                    <img src={user.image} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 shadow-lg rounded-xl py-2 hidden group-hover:block">
                    <Link href={`/dashboard/${user.role}`} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link href="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                      <User className="w-4 h-4" /> Update Profile
                    </Link>
                    <button onClick={() => setUser(null)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/sign-in" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition">
                  Sign In
                </Link>
                <Link href="/sign-up" className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600 hover:text-slate-900">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3">
          <Link href="/" className="block py-2 text-slate-600 font-medium">Home</Link>
          <Link href="/tuitions" className="block py-2 text-slate-600 font-medium">Browse Tuitions</Link>
          <Link href="/pricing" className="block py-2 text-slate-600 font-medium">Pricing</Link>
          <Link href="/about" className="block py-2 text-slate-600 font-medium">How It Works</Link>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/sign-in" className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl">Sign In</Link>
            <Link href="/sign-up" className="w-full text-center py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl">Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
}