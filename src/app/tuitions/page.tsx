"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Users,
  BookOpen,
  BadgeCheck,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";

interface TuitionItem {
  _id: string;
  id?: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location?: string;
  monthlyFee: number;
  daysPerWeek?: number;
  tutorName: string;
  tutorVerified?: boolean;
  bannerImage?: string;
  status?: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600";

const PAGE_LIMIT = 6;

export default function BrowseTuitionsPage() {
  const [tuitions, setTuitions] = useState<TuitionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: PAGE_LIMIT,
    totalPages: 1,
  });

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSubject, selectedMode]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTuitions = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("limit", String(PAGE_LIMIT));

        if (searchTerm.trim()) {
          params.set("search", searchTerm.trim());
        }
        if (selectedSubject !== "All") {
          params.set("subject", selectedSubject);
        }
        if (selectedMode !== "All") {
          params.set("mode", selectedMode);
        }

        const endpoint = `/tuitions?${params.toString()}`;

        const res = await apiRequest<{
          success: boolean;
          tuitions: TuitionItem[];
          pagination?: PaginationMeta;
          total?: number;
          totalPages?: number;
          page?: number;
        }>(endpoint, { signal: controller.signal });

        setTuitions(res.tuitions || []);

        const totalItems =
          res.pagination?.total ?? res.total ?? (res.tuitions?.length || 0);
        const totalPagesCount =
          res.pagination?.totalPages ??
          res.totalPages ??
          Math.max(1, Math.ceil(totalItems / PAGE_LIMIT));

        setPagination({
          total: totalItems,
          page: res.pagination?.page ?? res.page ?? currentPage,
          limit: res.pagination?.limit ?? PAGE_LIMIT,
          totalPages: Math.max(1, totalPagesCount),
        });
      } catch (error) {
        if ((error as Error)?.name === "AbortError") return;
        const message =
          error instanceof Error ? error.message : "Failed to load tuitions.";
        toast.error(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchTuitions, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchTerm, selectedSubject, selectedMode, currentPage]);

  const pageNumbers = Array.from(
    { length: pagination.totalPages },
    (_, idx) => idx + 1
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm tracking-widest uppercase">
            Explore Opportunities
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            Browse All Approved Tuitions
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Find the right batch or 1-on-1 mentor tailored to your academic
            needs and schedule.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, subject, tutor, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
            >
              <option value="All">All Subjects</option>
              <option value="Higher Mathematics">Higher Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Programming">Programming</option>
              <option value="IELTS & English">IELTS & English</option>
              <option value="Biology">Biology</option>
            </select>
          </div>

          {/* Mode Filter (Online / Offline) */}
          <div>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
            >
              <option value="All">All Modes (Online & Offline)</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>

        {/* Tuitions Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Loader2 className="w-9 h-9 text-indigo-600 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Loading approved tuitions...
            </p>
          </div>
        ) : tuitions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tuitions.map((tuition) => {
                const tuitionId = tuition._id || tuition.id || "";
                return (
                  <div
                    key={tuitionId}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col h-full group"
                  >
                    <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={tuition.bannerImage || DEFAULT_BANNER}
                        alt={tuition.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-indigo-700 dark:text-indigo-400 text-xs font-bold rounded-lg shadow">
                        {tuition.mode}
                      </span>
                      <span className="absolute top-3 right-3 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow">
                        ${tuition.monthlyFee} /mo
                      </span>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                        <span>{tuition.subject}</span>
                        <span>{tuition.classLevel}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2 mb-3">
                        {tuition.title}
                      </h3>
                      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300 mb-6">
                        <p className="flex items-center gap-2 flex-wrap">
                          <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                          <span>Tutor:</span>
                          <strong className="text-slate-800 dark:text-slate-100">
                            {tuition.tutorName}
                          </strong>
                          {tuition.tutorVerified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <BadgeCheck className="w-3.5 h-3.5" /> Verified
                            </span>
                          )}
                        </p>
                        {tuition.location && (
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            Location:{" "}
                            <span className="text-slate-800 dark:text-slate-100">
                              {tuition.location}
                            </span>
                          </p>
                        )}
                      </div>
                      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Link
                          href={`/tuitions/${tuitionId}`}
                          className="block w-full text-center py-2.5 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white font-bold rounded-xl transition"
                        >
                          View Details & Apply
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  Page{" "}
                  <strong className="text-slate-900 dark:text-white">
                    {currentPage}
                  </strong>{" "}
                  of{" "}
                  <strong className="text-slate-900 dark:text-white">
                    {pagination.totalPages}
                  </strong>{" "}
                  ({pagination.total} total tuitions)
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  {pageNumbers.map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-bold transition ${
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={currentPage >= pagination.totalPages}
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(pagination.totalPages, p + 1)
                      )
                    }
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              No tuitions found
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Try changing your search keywords or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}