"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle,
  Sparkles,
  ArrowRight,
  Loader2,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { apiRequest, authStorage, AuthUser } from "@/lib/api";

function PricingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const syncUser = () => {
      setCurrentUser(authStorage.getUser());
    };
    syncUser();
    window.addEventListener("mentorlagbe-auth-change", syncUser);
    return () => window.removeEventListener("mentorlagbe-auth-change", syncUser);
  }, []);

  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const sessionId = searchParams.get("session_id");

    if (paymentStatus === "cancelled") {
      toast.info("Stripe checkout was cancelled.");
      return;
    }

    if (paymentStatus === "success" && sessionId) {
      const verifySession = async () => {
        if (!authStorage.getToken()) {
          toast.success(
            "Payment completed! Please sign in to view your upgraded Pro status."
          );
          return;
        }

        setIsVerifying(true);
        try {
          const res = await apiRequest<{
            success: boolean;
            message: string;
            user?: AuthUser;
          }>("/payments/verify-session", {
            method: "POST",
            auth: true,
            body: JSON.stringify({ sessionId }),
          });

          if (res.user) {
            const existing = authStorage.getUser();
            authStorage.updateUser({
              ...(existing || {}),
              ...res.user,
              id: res.user.id || res.user._id || existing?.id || "",
            });
          }

          toast.success(res.message || "Pro Plan activated successfully!");
          router.replace("/pricing");
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to verify payment session.";
          toast.error(message);
        } finally {
          setIsVerifying(false);
        }
      };

      verifySession();
    }
  }, [searchParams, router]);

  const handleStripeCheckout = async () => {
    if (!currentUser || !authStorage.getToken()) {
      toast.error("Please sign in as a Student or Tutor to upgrade to Pro.");
      router.push("/sign-in");
      return;
    }

    if (currentUser.role === "admin") {
      toast.info("Admin accounts do not require Pro subscriptions.");
      return;
    }

    if (currentUser.plan === "pro") {
      toast.success("You are already on the Pro Plan!");
      return;
    }

    setIsCheckingOut(true);
    try {
      const res = await apiRequest<{
        success: boolean;
        url?: string;
        message?: string;
      }>("/payments/create-checkout-session", {
        method: "POST",
        auth: true,
      });

      if (res.url) {
        window.location.href = res.url;
      } else {
        toast.error(res.message || "Failed to get Stripe checkout URL.");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to initiate Stripe checkout.";
      toast.error(message);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const isAdmin = currentUser?.role === "admin";
  const isProMember = !isAdmin && currentUser?.plan === "pro";

  const activeRoleLabel =
    currentUser?.role === "tutor"
      ? "Pro Tutor ($15)"
      : currentUser?.role === "student"
        ? "Pro Student ($10)"
        : "Pro Plan ($10 - $15)";

  const displayPrice =
    currentUser?.role === "tutor"
      ? "$15"
      : currentUser?.role === "student"
        ? "$10"
        : "$10 - $15";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" /> Free vs. Pro Plans
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simple &amp; Transparent Membership
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Start completely free or upgrade to Pro for Tutors ($15) and
            Students ($10) via Stripe.
          </p>
          {isVerifying && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
              <Loader2 className="w-4 h-4 animate-spin" />
              Verifying your Stripe payment...
            </div>
          )}
        </div>

        {/* 2 Cards Grid: Free Plan vs Pro Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto items-stretch">
          {/* Card 1: Free Plan ($0) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 shadow-sm flex flex-col">
            <div className="mb-6">
              <span className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                Standard Access
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Free Plan
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                Essential features for casual learners and beginner tutors at zero
                cost.
              </p>
            </div>

            <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
              <span className="text-5xl font-extrabold text-slate-900 dark:text-white">
                $0
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                / forever
              </span>
            </div>

            <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300 mb-10 flex-grow">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>
                  <strong className="text-slate-900 dark:text-white">
                    Tutors:
                  </strong>{" "}
                  Post up to 2 active tuition listings
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>
                  <strong className="text-slate-900 dark:text-white">
                    Students:
                  </strong>{" "}
                  Browse and apply to approved tuitions
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>Standard dashboard tracking and updates</span>
              </li>
            </ul>

            <Link
              href="/sign-up"
              className="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold rounded-2xl transition flex items-center justify-center gap-2"
            >
              Get Started Free
            </Link>
          </div>

          {/* Card 2: Pro Plan ($10 / $15) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-600 dark:border-indigo-500 p-8 sm:p-10 shadow-xl flex flex-col relative">
            <span className="absolute top-6 right-6 bg-indigo-600 text-white text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow">
              {isAdmin
                ? "ADMIN ACCESS"
                : isProMember
                  ? "PRO ACTIVE"
                  : "RECOMMENDED"}
            </span>
            <div className="mb-6">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                Full Power Tier
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                {activeRoleLabel}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                Unlock unlimited potential for Tutors ($15) or priority booking
                for Students ($10).
              </p>
            </div>

            <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {displayPrice}
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                / one-time
              </span>
            </div>

            <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300 mb-10 flex-grow">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>
                  <strong className="text-slate-900 dark:text-white">
                    Unlimited Tutors Postings
                  </strong>{" "}
                  (vs. 2 limit)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Verified Pro Badge on profile &amp; listings</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>
                  Priority student bookings &amp; instant application reviews
                </span>
              </li>
            </ul>

            {isAdmin ? (
              <div className="w-full py-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Admin Account (No Pro Payment Needed)
              </div>
            ) : isProMember ? (
              <div className="w-full py-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold rounded-2xl flex items-center justify-center gap-2">
                <BadgeCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Pro Plan Active
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStripeCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 group"
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    Subscribe with Stripe
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <Loader2 className="w-9 h-9 text-indigo-600 animate-spin" />
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}