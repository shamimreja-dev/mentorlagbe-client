import Link from "next/link";
import {
  BookOpen,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-300 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand & Tagline */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="bg-indigo-600 group-hover:bg-indigo-500 p-2.5 rounded-xl text-white shadow-md shadow-indigo-950/50 transition">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Mentor<span className="text-indigo-400">Lagbe</span>
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Connecting verified subject-matter tutors with ambitious students
              for personalized 1-on-1 mentorship and structured academic batches.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/70 text-xs font-medium text-slate-300">
              <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Verified Tutors & Secure Stripe Checkout</span>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="w-10 h-10 bg-slate-800/90 hover:bg-indigo-600 border border-slate-700/70 hover:border-indigo-500 text-slate-200 hover:text-white rounded-xl transition flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 bg-slate-800/90 hover:bg-indigo-600 border border-slate-700/70 hover:border-indigo-500 text-slate-200 hover:text-white rounded-xl transition flex items-center justify-center text-xs font-bold tracking-wide"
              >
                FB
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 bg-slate-800/90 hover:bg-indigo-600 border border-slate-700/70 hover:border-indigo-500 text-slate-200 hover:text-white rounded-xl transition flex items-center justify-center text-xs font-bold tracking-wide"
              >
                IN
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 hover:text-indigo-400 transition inline-flex items-center gap-1 group"
                >
                  <span>Home</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link
                  href="/tuitions"
                  className="text-slate-400 hover:text-indigo-400 transition inline-flex items-center gap-1 group"
                >
                  <span>Browse Tuitions</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-slate-400 hover:text-indigo-400 transition inline-flex items-center gap-1 group"
                >
                  <span>Pricing & Pro Plans</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link
                  href="/sign-up"
                  className="text-slate-400 hover:text-indigo-400 transition inline-flex items-center gap-1 group"
                >
                  <span>Become a Tutor</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Top Subjects
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/tuitions?search=Mathematics"
                  className="text-slate-400 hover:text-indigo-400 transition inline-flex items-center gap-1 group"
                >
                  <span>Higher Mathematics</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link
                  href="/tuitions?search=Physics"
                  className="text-slate-400 hover:text-indigo-400 transition inline-flex items-center gap-1 group"
                >
                  <span>Physics & Chemistry</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link
                  href="/tuitions?search=Programming"
                  className="text-slate-400 hover:text-indigo-400 transition inline-flex items-center gap-1 group"
                >
                  <span>Web & Programming</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link
                  href="/tuitions?search=IELTS"
                  className="text-slate-400 hover:text-indigo-400 transition inline-flex items-center gap-1 group"
                >
                  <span>IELTS & Spoken English</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-800/90 border border-slate-700/70 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                </span>
                <span className="leading-relaxed">
                  Dhanmondi, Dhaka-1209, Bangladesh
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-800/90 border border-slate-700/70 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-indigo-400" />
                </span>
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-800/90 border border-slate-700/70 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-indigo-400" />
                </span>
                <span className="break-all">support@mentorlagbe.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-slate-800/90 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
          <p>© {new Date().getFullYear()} MentorLagbe. All rights reserved.</p>
          <p className="text-slate-500">
            Online & Home Tuition Finder and Booking Platform
          </p>
        </div>
      </div>
    </footer>
  );
}