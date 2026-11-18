import Link from "next/link";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Mentor<span className="text-indigo-400">Lagbe</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connecting verified subject-matter tutors with ambitious students
              for personalized 1-on-1 mentorship and structured academic batches.
            </p>
            {/* Social Media Links with New X Logo */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="p-2.5 bg-slate-800 hover:bg-indigo-600 text-white rounded-lg transition"
              >
                {/* Official New X Logo SVG */}
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
                className="p-2.5 bg-slate-800 hover:bg-indigo-600 text-white rounded-lg transition text-xs font-bold"
              >
                FB
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-indigo-600 text-white rounded-lg transition text-xs font-bold"
              >
                IN
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/tuitions" className="hover:text-indigo-400 transition">
                  Browse Tuitions
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-indigo-400 transition">
                  Pricing & Pro Plans
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="hover:text-indigo-400 transition">
                  Become a Tutor
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">Top Subjects</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tuitions?search=Mathematics" className="hover:text-indigo-400 transition">
                  Higher Mathematics
                </Link>
              </li>
              <li>
                <Link href="/tuitions?search=Physics" className="hover:text-indigo-400 transition">
                  Physics & Chemistry
                </Link>
              </li>
              <li>
                <Link href="/tuitions?search=Programming" className="hover:text-indigo-400 transition">
                  Web & Programming
                </Link>
              </li>
              <li>
                <Link href="/tuitions?search=IELTS" className="hover:text-indigo-400 transition">
                  IELTS & Spoken English
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-base mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Dhanmondi, Dhaka-1209, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+880 1700-000000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@mentorlagbe.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} MentorLagbe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}