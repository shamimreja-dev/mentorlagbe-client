"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  BookOpen,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  ShieldCheck,
  User,
  Users,
  Calendar,
  Phone,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

export default function TuitionDetailsPage() {
  const params = useParams();
  const id = params?.id;

  // ডেমো ইউজার (Auth কানেক্ট হওয়ার পর ডাইনামিক হবে)
  // রোল টেস্ট করতে role: 'student' এর বদলে 'tutor' বা 'admin' দিয়ে দেখতে পারো।
  const user = {
    name: "Ariful Islam",
    email: "ariful@gmail.com",
    role: "student", // 'student' | 'tutor' | 'admin'
    phone: "+8801700000000",
  };

  // ডেমো টিউশন ডিটেইলস ডেটা
  const tuition = {
    id: id || "1",
    title: "HSC Higher Math & Physics 1-on-1 Mentorship",
    subject: "Higher Mathematics",
    classLevel: "HSC (Class 11-12)",
    mode: "Online",
    location: "Online via Zoom / Google Meet",
    monthlyFee: 35,
    daysPerWeek: 3,
    bannerImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800",
    description:
      "This comprehensive 1-on-1 mentorship program is specially designed for HSC candidates aiming for A+ in Higher Mathematics and Physics. We will cover complex calculus, vectors, trigonometry, mechanics, and past paper problem-solving techniques with regular mock tests.",
    tutorName: "Prof. Tanvir Ahmed",
    tutorEmail: "tanvir.ahmed@gmail.com",
    tutorBio: "Senior Mathematics Professor with 10+ years of experience guiding HSC and O/A Level students to academic excellence.",
    tutorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
  };

  // Application Form State
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [studentPhone, setStudentPhone] = useState(user.phone || "");
  const [studentNote, setStudentNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Application Submit Handler
  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.role !== "student") {
      toast.error("Only users with a Student role can apply for tuitions!");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Tuition application submitted successfully!");
      // এখানে ব্যাকএন্ডে API রিকোয়েস্ট যাবে অ্যাপ্লিকেশন সেভ করার জন্য
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Tuition Banner & Details */}
          <div className="lg:col-span-8 space-y-8">
            {/* Banner Image */}
            <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-md bg-slate-200">
              <img
                src={tuition.bannerImage}
                alt={tuition.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3.5 py-1.5 bg-white/90 backdrop-blur text-indigo-700 text-xs font-bold rounded-xl shadow">
                  {tuition.mode}
                </span>
                <span className="px-3.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow">
                  ${tuition.monthlyFee} /mo
                </span>
              </div>
            </div>

            {/* Title & Info Meta */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-3 text-sm font-semibold text-indigo-600 mb-2">
                  <span>{tuition.subject}</span>
                  <span>•</span>
                  <span>{tuition.classLevel}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {tuition.title}
                </h1>
              </div>

              {/* Key Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-4 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Schedule</p>
                    <p className="text-sm font-bold text-slate-800">{tuition.daysPerWeek} Days / Week</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Mode / Location</p>
                    <p className="text-sm font-bold text-slate-800">{tuition.mode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Monthly Fee</p>
                    <p className="text-sm font-bold text-slate-800">${tuition.monthlyFee}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-900">About This Tuition</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {tuition.description}
                </p>
              </div>

              {/* Tutor Profile Summary Card */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                <img
                  src={tuition.tutorImage}
                  alt={tuition.tutorName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-base">{tuition.tutorName}</h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified Tutor
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{tuition.tutorBio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Role-Restricted Application Form / Notice */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm sticky top-28 space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Apply for Tuition</h3>
                <p className="text-xs text-slate-500 mt-1">Submit your details to book this batch or mentorship.</p>
              </div>

              {user.role === "student" ? (
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user.name}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Email
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+88017xxxxxxxx"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Preferred Schedule *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Evening (4 PM - 6 PM)"
                      value={preferredSchedule}
                      onChange={(e) => setPreferredSchedule(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Learning Note (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mention any specific topic you want to focus on..."
                      value={studentNote}
                      onChange={(e) => setStudentNote(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center space-y-3">
                  <p className="text-xs font-bold uppercase text-amber-800 tracking-wider">
                    Access Restricted
                  </p>
                  <p className="text-sm text-amber-900">
                    You are logged in as a <strong className="uppercase">{user.role}</strong>. Only users with the <strong className="underline">Student</strong> role are allowed to apply for tuition batches.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}