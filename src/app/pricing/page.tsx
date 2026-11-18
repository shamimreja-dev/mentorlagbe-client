"use client";

import Link from "next/link";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function PricingPage() {
  const handleStripeCheckout = (planName: string, price: number) => {
    toast.loading(`Redirecting to Stripe Checkout for ${planName} ($${price})...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Stripe checkout initialized for ${planName}!`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
            <Sparkles className="w-3.5 h-3.5" /> Free vs. Pro Plans
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Simple & Transparent Membership
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Start completely free or upgrade to Pro for Tutors ($15) and Students ($10) via Stripe.
          </p>
        </div>

        {/* 2 Cards Grid: Free Plan vs Pro Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto items-stretch">
          {/* Card 1: Free Plan ($0) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm flex flex-col">
            <div className="mb-6">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">
                Standard Access
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Free Plan</h3>
              <p className="text-slate-500 text-sm mt-2">
                Essential features for casual learners and beginner tutors at zero cost.
              </p>
            </div>

            <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-slate-100">
              <span className="text-5xl font-extrabold text-slate-900">$0</span>
              <span className="text-slate-500 font-medium">/ forever</span>
            </div>

            <ul className="space-y-4 text-sm text-slate-700 mb-10 flex-grow">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400 shrink-0" />
                <span><strong>Tutors:</strong> Post up to 2 active tuition listings</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400 shrink-0" />
                <span><strong>Students:</strong> Browse and apply to approved tuitions</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400 shrink-0" />
                <span>Standard dashboard tracking and updates</span>
              </li>
            </ul>

            <Link
              href="/sign-up"
              className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl transition flex items-center justify-center gap-2"
            >
              Get Started Free
            </Link>
          </div>

          {/* Card 2: Pro Plan ($10 / $15) */}
          <div className="bg-white rounded-3xl border-2 border-indigo-600 p-8 sm:p-10 shadow-xl flex flex-col relative">
            <span className="absolute top-6 right-6 bg-indigo-600 text-white text-[10px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow">
              RECOMMENDED
            </span>
            <div className="mb-6">
              <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider">
                Full Power Tier
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">Pro Plan</h3>
              <p className="text-slate-500 text-sm mt-2">
                Unlock unlimited potential for Tutors ($15) or priority booking for Students ($10).
              </p>
            </div>

            <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-slate-100">
              <span className="text-4xl font-extrabold text-slate-900">$10 - $15</span>
              <span className="text-slate-500 font-medium">/ one-time</span>
            </div>

            <ul className="space-y-4 text-sm text-slate-700 mb-10 flex-grow">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                <span><strong>Unlimited Tutors Postings</strong> (vs. 2 limit)</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>Verified Pro Badge on profile & listings</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>Priority student bookings & instant application reviews</span>
              </li>
            </ul>

            <button
              onClick={() => handleStripeCheckout("Pro Plan", 15)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 group"
            >
              Subscribe with Stripe
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}