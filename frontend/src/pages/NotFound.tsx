import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-700">404</p>
      <h2 className="mt-3 text-4xl font-bold text-slate-900">Page not found</h2>
      <p className="mt-4 text-sm leading-7 text-slate-600">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800"
      >
        Return Home
      </Link>
    </div>
  );
}