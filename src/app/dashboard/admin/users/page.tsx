"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCog,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest, authStorage, AuthUser, UserPlan, UserRole } from "@/lib/api";

interface PlatformUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  plan: UserPlan;
  isVerifiedTutor?: boolean;
  createdAt?: string;
  joinedAt?: string;
}

export default function AdminUsersPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  useEffect(() => {
    setCurrentUser(authStorage.getUser());
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!authStorage.getToken()) {
        setIsLoading(false);
        router.push("/sign-in");
        return;
      }

      setIsLoading(true);
      try {
        const res = await apiRequest<{
          success: boolean;
          users: PlatformUser[];
        }>("/admin/users", { auth: true });

        setUsers(res.users || []);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to load users.";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setActionUserId(userId);
    try {
      const res = await apiRequest<{
        success: boolean;
        message?: string;
        user?: PlatformUser;
      }>(`/admin/users/${userId}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ role: newRole }),
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId
            ? { ...u, role: res.user?.role || newRole }
            : u
        )
      );
      toast.success(
        res.message || `User role updated to ${newRole.toUpperCase()}`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update user role.";
      toast.error(message);
    } finally {
      setActionUserId(null);
    }
  };

  const handleTogglePlan = async (user: PlatformUser) => {
    const nextPlan: UserPlan = user.plan === "free" ? "pro" : "free";
    setActionUserId(user._id);
    try {
      const res = await apiRequest<{
        success: boolean;
        message?: string;
        user?: PlatformUser;
      }>(`/admin/users/${user._id}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({
          plan: nextPlan,
          isVerifiedTutor: user.role === "tutor" ? nextPlan === "pro" : undefined,
        }),
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === user._id
            ? {
                ...u,
                plan: res.user?.plan || nextPlan,
                isVerifiedTutor:
                  res.user?.isVerifiedTutor ??
                  (u.role === "tutor" ? nextPlan === "pro" : u.isVerifiedTutor),
              }
            : u
        )
      );
      toast.success(
        res.message ||
          `${user.name}'s plan switched to ${nextPlan.toUpperCase()}`
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update user plan.";
      toast.error(message);
    } finally {
      setActionUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    const currentId = currentUser?.id || currentUser?._id;
    if (currentId && currentId === userId) {
      toast.error("You cannot delete your own active admin account.");
      return;
    }

    setActionUserId(userId);
    try {
      const res = await apiRequest<{ success: boolean; message?: string }>(
        `/admin/users/${userId}`,
        {
          method: "DELETE",
          auth: true,
        }
      );

      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success(res.message || `Removed user ${name}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete user.";
      toast.error(message);
    } finally {
      setActionUserId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone || "").toLowerCase().includes(q);
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
            View registered accounts, update user roles, and manage Free vs. Pro
            tiers.
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm self-start">
          <UserCog className="w-4 h-4 text-indigo-600" /> {users.length} Total
          Users
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
        {isLoading ? (
          <div className="py-16 px-6 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
            <p className="text-xs font-medium text-slate-500">
              Loading platform users...
            </p>
          </div>
        ) : (
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
                  filteredUsers.map((user) => {
                    const rawDate = user.joinedAt || user.createdAt;
                    const formattedDate = rawDate
                      ? new Date(rawDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "";
                    const isBusy = actionUserId === user._id;

                    return (
                      <tr
                        key={user._id}
                        className="hover:bg-slate-50/70 transition"
                      >
                        <td className="py-4 px-6">
                          <p className="font-bold text-slate-900">
                            {user.name}
                          </p>
                          {formattedDate && (
                            <p className="text-xs text-slate-400">
                              Joined {formattedDate}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-600 space-y-0.5">
                          <p className="font-semibold text-slate-800">
                            {user.email}
                          </p>
                          {user.phone && <p>{user.phone}</p>}
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={user.role}
                            disabled={isBusy}
                            onChange={(e) =>
                              handleRoleChange(
                                user._id,
                                e.target.value as UserRole
                              )
                            }
                            aria-label={`Change role for ${user.name}`}
                            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-60"
                          >
                            <option value="student">student</option>
                            <option value="tutor">tutor</option>
                            <option value="admin">admin</option>
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => handleTogglePlan(user)}
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase transition disabled:opacity-60 ${
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
                            disabled={isBusy}
                            onClick={() =>
                              handleDeleteUser(user._id, user.name)
                            }
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-60 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })
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
        )}
      </div>
    </div>
  );
}