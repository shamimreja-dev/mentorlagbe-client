"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Users, Filter, BookOpen } from "lucide-react";

export default function BrowseTuitionsPage() {
  // ডেমো টিউশন ডেটা (পরবর্তীতে ব্যাকএন্ড API থেকে ফেচ হবে)
  const allTuitions = [
    {
      id: "1",
      title: "HSC Higher Math & Physics 1-on-1 Mentorship",
      subject: "Higher Mathematics",
      classLevel: "HSC (Class 11-12)",
      mode: "Online",
      monthlyFee: 35,
      tutorName: "Prof. Tanvir Ahmed",
      bannerImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600",
      approvalStatus: "approved",
      isActive: true,
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
      bannerImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
      approvalStatus: "approved",
      isActive: true,
    },
    {
      id: "3",
      title: "Full-Stack Web Development with Next.js",
      subject: "Programming",
      classLevel: "University / Professional",
      mode: "Online",
      monthlyFee: 60,
      tutorName: "Imtiaz Hossain",
      bannerImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600",
      approvalStatus: "approved",
      isActive: true,
    },
    {
      id: "4",
      title: "IELTS Academic Band 8+ Masterclass",
      subject: "IELTS & English",
      classLevel: "College / Admission",
      mode: "Online",
      monthlyFee: 40,
      tutorName: "Nusrat Jahan",
      bannerImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
      approvalStatus: "approved",
      isActive: true,
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
      bannerImage: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=600",
      approvalStatus: "approved",
      isActive: true,
    },
    {
      id: "6",
      title: "Python Programming & Data Science for Beginners",
      subject: "Programming",
      classLevel: "High School / University",
      mode: "Online",
      monthlyFee: 45,
      tutorName: "Sadia Sultana",
      bannerImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600",
      approvalStatus: "approved",
      isActive: true,
    },
  ];

  // স্টেট ফর সার্চ এবং ফিল্টার
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");

  // ফিল্টারিং লজিক
  const filteredTuitions = allTuitions.filter((tuition) => {
    const matchesSearch =
      tuition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tuition.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject =
      selectedSubject === "All" || tuition.subject === selectedSubject;
    
    const matchesMode =
      selectedMode === "All" || tuition.mode === selectedMode;

    return matchesSearch && matchesSubject && matchesMode && tuition.approvalStatus === "approved" && tuition.isActive;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">
            Explore Opportunities
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            Browse All Approved Tuitions
          </h1>
          <p className="text-slate-600 mt-2">
            Find the right batch or 1-on-1 mentor tailored to your academic needs and schedule.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
            />
          </div>

          {/* Subject Filter */}
          <div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
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
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition"
            >
              <option value="All">All Modes (Online & Offline)</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
        </div>

        {/* Tuitions Grid */}
        {filteredTuitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTuitions.map((tuition) => (
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
                      View Details & Apply
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No tuitions found</h3>
            <p className="text-sm text-slate-500 mt-1">
              Try changing your search keywords or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}