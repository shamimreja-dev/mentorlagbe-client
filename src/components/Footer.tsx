import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <span className="text-2xl font-extrabold text-white">MentorLagbe</span>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connecting qualified tutors and eager students in a seamless, smart tuition and mentorship platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/tuitions" className="hover:text-white transition">Browse Tuitions</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing Plans</Link></li>
              <li><Link href="/about" className="hover:text-white transition">How It Works</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Email: support@mentorlagbe.com</li>
              <li>Phone: +880 1234-567890</li>
              <li>Location: Dhaka, Bangladesh</li>
            </ul>
          </div>

          {/* Social Media (With New X Logo) */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Follow Us</h4>
            <div className="flex items-center gap-3">
              {/* X (Twitter) Official Rebranded SVG */}
              <a href="https://x.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition text-white">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition text-white">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.5 5 15.5 5H18V0h-3.808C10.59 0 9 1.581 9 4.75V8z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition text-white">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500">
          <p>© {new Date().getFullYear()} MentorLagbe. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}