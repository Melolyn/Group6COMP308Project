import { Link, NavLink, Outlet } from "react-router-dom";
import {
  Accessibility,
  BarChart3,
  ClipboardList,
  House,
  LogIn,
  ShieldCheck,
} from "lucide-react";


const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-sky-100 text-sky-900"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
  }`;

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <Link to="/" className="flex items-center gap-3 text-slate-900">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-700 text-white shadow-sm">
                  <Accessibility size={22} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                    Civic Accessibility Portal
                  </p>
                  <h1 className="text-xl font-bold md:text-2xl">Access GTA</h1>
                </div>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                Inclusive city services
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                Responsive design
              </span>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2 border-t border-slate-200 pt-3">
            <NavLink to="/" className={navLinkClass}>
              <span className="inline-flex items-center gap-2">
                <House size={16} /> Home
              </span>
            </NavLink>

            <NavLink to="/report" className={navLinkClass}>
              <span className="inline-flex items-center gap-2">
                <ClipboardList size={16} /> Report Issue
              </span>
            </NavLink>

            <NavLink to="/my-issues" className={navLinkClass}>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={16} /> My Issues
              </span>
            </NavLink>

            <NavLink to="/staff-dashboard" className={navLinkClass}>
              <span className="inline-flex items-center gap-2">
                <BarChart3 size={16} /> Staff Dashboard
              </span>
            </NavLink>

            <NavLink to="/analytics" className={navLinkClass}>
              <span className="inline-flex items-center gap-2">
                <BarChart3 size={16} /> Analytics
              </span>
            </NavLink>

            <NavLink to="/login" className={navLinkClass}>
              <span className="inline-flex items-center gap-2">
                <LogIn size={16} /> Login
              </span>
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-slate-600 md:grid-cols-3 md:px-6 lg:px-8">
          <div>
            <h3 className="mb-2 font-semibold text-slate-900">Access Oshawa</h3>
            <p>
              Accessibility-focused issue reporting for sidewalks, ramps, crossings, signage, transit access,
              and public spaces.
            </p>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-slate-900">Focus Areas</h3>
            <ul className="space-y-1">
              <li>Barrier reporting</li>
              <li>Status tracking</li>
              <li>Staff triage</li>
              <li>AI-assisted summaries</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 font-semibold text-slate-900">Project Stack</h3>
            <p>React · TypeScript · Tailwind CSS · Apollo Client · GraphQL-ready</p>
          </div>
        </div>
      </footer>
    </div>
  );
}