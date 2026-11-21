import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MentorLagbe | Smart Tuition & Mentorship Platform",
  description: "Find verified tutors and structured tuition batches online & offline.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col min-h-screen transition-colors`}
      >
        <Toaster position="top-right" richColors />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}