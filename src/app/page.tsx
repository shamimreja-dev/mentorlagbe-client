import Link from "next/link";
import {
  CheckCircle,
  Users,
  Zap,
  ArrowRight,
  MapPin,
} from "lucide-react";

export default function HomePage() {
  // ডেমো ফিচার্ড টিউশন লিস্ট
  const featuredTuitions = [
    {
      id: "1",
      title: "HSC Higher Math & Physics 1-on-1 Mentorship",
      subject: "Higher Mathematics",
      classLevel: "HSC (Class 11-12)",
      mode: "Online",
      monthlyFee: 35,
      tutorName: "Prof. Tanvir Ahmed",
      bannerImage:
        "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "2",
      title: "O-Level Physics & Chemistry Intensive Batch",
      subject: "Physics",
      classLevel: "O-Level",
      mode: "Offline",
      location: "Dhanmondi, Dhaka",
      monthlyFee: 50,
      tutorName: "Sumaiya Rahman",
      bannerImage:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "3",
      title: "Full-Stack Web Development with Next.js",
      subject: "Programming",
      classLevel: "University / Professional",
      mode: "Online",
      monthlyFee: 60,
      tutorName: "Imtiaz Hossain",
      bannerImage:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "4",
      title: "IELTS Academic Band 8+ Masterclass",
      subject: "IELTS & English",
      classLevel: "College / Admission",
      mode: "Online",
      monthlyFee: 40,
      tutorName: "Nusrat Jahan",
      bannerImage:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "5",
      title: "Class 9-10 General Science & Biology Batch",
      subject: "Biology",
      classLevel: "SSC (Class 9-10)",
      mode: "Offline",
      location: "Uttara, Dhaka",
      monthlyFee: 25,
      tutorName: "Dr. Nazmul Haque",
      bannerImage:
        "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "6",
      title: "Python Programming & Data Science for Beginners",
      subject: "Programming",
      classLevel: "High School / University",
      mode: "Online",
      monthlyFee: 45,
      tutorName: "Sadia Sultana",
      bannerImage:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-indigo-900 via-indigo-800 to-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Zap className="w-4 h-4 text-amber-400" /> Smart Tuition & Mentorship Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Find Your Ideal Tutor or <span className="text-indigo-400">Mentorship Batch</span> Today
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0">
              Connect with verified subject experts for personalized 1-on-1 guidance, online batches, or local home tuitions tailored to your monthly budget.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/tuitions"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 group"
              >
                Browse All Tuitions
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>
              <Link
                href="/sign-up"
                className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition text-center"
              >
                Join as a Tutor
              </Link>
            </div>
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-indigo-800/60 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">500+</p>
                <p className="text-xs text-slate-400 font-medium">Verified Tutors</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">1,200+</p>
                <p className="text-xs text-slate-400 font-medium">Active Batches</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-white">98%</p>
                <p className="text-xs text-slate-400 font-medium">Success Rate</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-xl opacity-30"></div>
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
                alt="Students learning with mentor"
                className="relative rounded-2xl shadow-2xl object-cover border border-indigo-500/20 w-full h-[420px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Dynamic Featured Tuitions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">Verified Listings</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Featured Tuition Batches</h2>
          </div>
          <Link
            href="/tuitions"
            className="mt-4 md:mt-0 text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 group"
          >
            View All Tuitions <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Grid with Equal Card Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTuitions.map((tuition) => (
            <div
              key={tuition.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col h-full group"
            >
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={tuition.bannerImage}
                  alt={tuition.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur text-indigo-700 text-xs font-bold rounded-lg shadow">
                  {tuition.mode}
                </span>
                <span className="absolute top-3 right-3 px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg shadow">
                  ${tuition.monthlyFee} /mo
                </span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span>{tuition.subject}</span>
                  <span>{tuition.classLevel}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-2 mb-3">
                  {tuition.title}
                </h3>
                <div className="space-y-2 text-sm text-slate-600 mb-6">
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600 shrink-0" />
                    Tutor: <strong className="text-slate-800">{tuition.tutorName}</strong>
                  </p>
                  {tuition.location && (
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                      Location: <span className="text-slate-800">{tuition.location}</span>
                    </p>
                  )}
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <Link
                    href={`/tuitions/${tuition.id}`}
                    className="block w-full text-center py-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-bold rounded-xl transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Extra Section 1 — How MentorLagbe Works */}
      <section id="how-it-works" className="py-20 bg-slate-100 border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">Simple Workflow</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">How MentorLagbe Works</h2>
            <p className="text-slate-600 mt-2">A seamless platform connecting ambitious students with verified expert tutors in 3 easy steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative">
              <div className="w-12 h-12 bg-indigo-600 text-white font-extrabold text-xl rounded-xl flex items-center justify-center mb-6 shadow-md">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Register & Choose Role</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Sign up easily via BetterAuth as a Student looking for academic guidance or as a Tutor wanting to host batches.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative">
              <div className="w-12 h-12 bg-indigo-600 text-white font-extrabold text-xl rounded-xl flex items-center justify-center mb-6 shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Search & Apply or Post</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Students browse approved tuitions with advanced filters and apply instantly. Tutors post batches with ImgBB banners.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 relative">
              <div className="w-12 h-12 bg-indigo-600 text-white font-extrabold text-xl rounded-xl flex items-center justify-center mb-6 shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Connect & Learn</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Tutors accept qualified applicants, and students embark on their personalized online or offline learning journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pricing / Subscription Section (Free vs Pro Plans) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">
            Pricing Plans
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
            Choose Your Learning Journey
          </h2>
          <p className="text-slate-600 mt-2">
            Upgrade your account to unlock unlimited postings, priority placement, and verified badges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Card 1: Free Plan ($0) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col relative">
            <span className="self-start bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full uppercase mb-4">
              Free Access
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Free Plan</h3>
            <p className="text-slate-600 text-sm mb-6">
              Essential features for casual learners and beginner tutors.
            </p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-slate-900">$0</span>
              <span className="text-slate-500 font-medium">/ forever</span>
            </div>
            <ul className="space-y-4 text-sm text-slate-700 mb-8 flex-grow">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400 shrink-0" />
                <span>Post up to 2 active tuition listings (For Tutors)</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400 shrink-0" />
                <span>Browse and apply to standard batches (For Students)</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-slate-400 shrink-0" />
                <span>Standard dashboard tracking</span>
              </li>
            </ul>
            <Link
              href="/sign-up"
              className="block w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-center transition"
            >
              Get Started Free
            </Link>
          </div>

          {/* Card 2: Pro Plan ($15) with RECOMMENDED badge */}
          <div className="bg-white rounded-3xl border-2 border-indigo-600 p-8 shadow-xl flex flex-col relative">
            <span className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              RECOMMENDED
            </span>
            <span className="self-start bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase mb-4">
              Pro Access
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Pro Plan</h3>
            <p className="text-slate-600 text-sm mb-6">
              Unlock unlimited potential with advanced tools and priority visibility.
            </p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-slate-900">$15</span>
              <span className="text-slate-500 font-medium">/ one-time</span>
            </div>
            <ul className="space-y-4 text-sm text-slate-700 mb-8 flex-grow">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                <span><strong>Unlimited</strong> tuition posts & priority placement</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>Verified Pro Badge on profile & listings</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>Priority booking & direct application review</span>
              </li>
            </ul>
            <Link
              href="/pricing"
              className="block w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-center shadow-md transition"
            >
              Subscribe with Stripe
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Extra Section 2 — Top Subjects & Statistics (Updated background to indigo-950 for better separation from footer) */}
      <section className="py-20 bg-indigo-950 text-white px-4 sm:px-6 lg:px-8 border-t border-indigo-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-indigo-400 font-bold text-sm tracking-widest uppercase">Popular Categories</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Explore Top Subjects</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Link href="/tuitions?search=Mathematics" className="bg-indigo-900/60 hover:bg-indigo-600 p-6 rounded-2xl border border-indigo-800 text-center transition group">
              <h3 className="text-lg font-bold group-hover:text-white">Mathematics</h3>
              <p className="text-xs text-indigo-300 mt-1">120+ Active Batches</p>
            </Link>
            <Link href="/tuitions?search=Physics" className="bg-indigo-900/60 hover:bg-indigo-600 p-6 rounded-2xl border border-indigo-800 text-center transition group">
              <h3 className="text-lg font-bold group-hover:text-white">Physics & Chem</h3>
              <p className="text-xs text-indigo-300 mt-1">95+ Active Batches</p>
            </Link>
            <Link href="/tuitions?search=Programming" className="bg-indigo-900/60 hover:bg-indigo-600 p-6 rounded-2xl border border-indigo-800 text-center transition group">
              <h3 className="text-lg font-bold group-hover:text-white">Programming</h3>
              <p className="text-xs text-indigo-300 mt-1">80+ Active Batches</p>
            </Link>
            <Link href="/tuitions?search=IELTS" className="bg-indigo-900/60 hover:bg-indigo-600 p-6 rounded-2xl border border-indigo-800 text-center transition group">
              <h3 className="text-lg font-bold group-hover:text-white">IELTS & English</h3>
              <p className="text-xs text-indigo-300 mt-1">110+ Active Batches</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}