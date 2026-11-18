"use client";

import { useState } from "react";
import {
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";

type UserRole = "student" | "tutor" | "admin";
type UserPlan = "free" | "pro";

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  plan: UserPlan;
  joinedAt: string;
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");

  const [users, setUsers] = useState<PlatformUser[]>([
    {
      id: "usr-1",
      name: "Ariful Islam",
      email: "ariful@gmail.com",
      phone: "+8801700000000",
      role: "student",
      plan: "pro",
      joinedAt: "2026-10-12",
    },
    {
      id: "usr-2",
      name: "Prof. Tanvir Ahmed",
      email: "tanvir.ahmed@gmail.com",
      phone: "+8801711223344",
      role: "tutor",
      plan: "pro",
      joinedAt: "2026-10-15",
    },
    {
      id: "usr-3",
      name: "Nabila Rahman",
      email: "nabila@gmail.com",
      phone: "+8801811223355",
      role: "student",
      plan: "free",
      joinedAt: "2026-11-01",
    },
    {
      id: "usr-4",
      name: "Sadia Sultana",
      email: "sadia.tutor@gmail.com",
      phone: "+8801911223366",
      role: "tutor",
      plan: "free",
      joinedAt: "2026-11-05",
    },
    {
      id: "usr-5",
      name: "Admin User",
      email: "admin@mentorlagbe.com",
      phone: "+8801500000099",
      role: "admin",
      plan: "pro",
      joinedAt: "2026-10-01",
    },
  ]);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    toast.success(`User role updated to ${newRole.toUpperCase()}`);
  };

  const handleTogglePlan = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const nextPlan: UserPlan = u.plan === "free" ? "pro" : "free";
        toast.success(`${u.name}'s plan switched to ${nextPlan.toUpperCase()}`);
        return { ...u, plan: nextPlan };
      })
    );
  };

  const handleDeleteUser = (userId: string, name: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    toast.success(`Removed user ${name}`);
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Users & Roles Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View registered accounts, update user roles, and manage Free vs. Pro tiers.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm self-start">
          <UserCog className="w-4 h-4 text-indigo-600" /> {users.length} Total Users
        </span>
      </div>

      {/* Search & Role Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start">
          {(["all", "student", "tutor", "admin"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                roleFilter === r
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-6">Contact</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Plan Tier</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-400">
                        Joined {user.joinedAt}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-600 space-y-0.5">
                      <p className="font-semibold text-slate-800">{user.email}</p>
                      <p>{user.phone}</p>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value as UserRole)
                        }
                        aria-label={`Change role for ${user.name}`}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                      >
                        <option value="student">student</option>
                        <option value="tutor">tutor</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        type="button"
                        onClick={() => handleTogglePlan(user.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase transition ${
                          user.plan === "pro"
                            ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                        title="Click to toggle Free / Pro plan"
                      >
                        {user.plan === "pro" ? (
                          <Sparkles className="w-3 h-3" />
                        ) : (
                          <ShieldCheck className="w-3 h-3" />
                        )}
                        {user.plan}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 px-6 text-center text-sm text-slate-500"
                  >
                    No users match your search or role filter.
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