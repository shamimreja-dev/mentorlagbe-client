import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-extrabold text-indigo-600">404</h1>
      <h2 className="text-2xl font-bold text-slate-900 mt-4">Page Not Found</h2>
      <p className="text-slate-600 max-w-md mt-2">
        Sorry, the tuition or page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
      >
        Back to Home
      </Link>
    </div>
  );
}