import { Link } from "react-router-dom";
import {
  Accessibility,
  BellRing,
  Bot,
  MapPinned,
  ShieldCheck,
} from "lucide-react";

import picture from "../assets/picture.jpg";

type AppUserRole = "resident" | "staff" | "advocate";

type StoredUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AppUserRole;
};

const highlights = [
  {
    title: "Report accessibility barriers",
    description:
      "Submit issues related to ramps, crossings, sidewalks, transit stops, signs, and entrances.",
    icon: Accessibility,
  },
  {
    title: "Track progress clearly",
    description:
      "Residents can follow the status of submitted issues from open to resolved.",
    icon: ShieldCheck,
  },
  {
    title: "Get informed updates",
    description:
      "Receive staff updates and high-priority alerts related to mobility and public access.",
    icon: BellRing,
  },
  {
    title: "AI-supported assistance",
    description:
      "Summaries, categorization, and trend insights help staff prioritize accessibility needs.",
    icon: Bot,
  },
];

function getCurrentUser(): StoredUser | null {
  const raw = localStorage.getItem("civicai_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export default function Home() {
  const user = getCurrentUser();

  const isResident = user?.role === "resident";
  const isStaff = user?.role === "staff";
  const isAdvocate = user?.role === "advocate";

  const heroTitle = isStaff
    ? "Support faster issue response across the city."
    : isAdvocate
    ? "Monitor accessibility trends and help residents effectively."
    : "Building a more accessible city starts with you.";

  const heroSubtitle = isStaff
    ? "Review reported barriers, update statuses, and prioritize high-impact accessibility issues."
    : isAdvocate
    ? "Use analytics and insights to identify patterns, support residents, and improve accessibility awareness."
    : "Report barriers, follow issue progress, and support a more inclusive city through accessible service design.";

  return (
    <div className="space-y-10">
      <section className="relative h-[400px] w-full overflow-hidden rounded-3xl md:h-[500px]">
        <img
          src={picture}
          alt="Accessibility pathway with wheelchair user"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex h-full flex-col justify-center px-6 text-white md:px-12">
          <h1 className="max-w-2xl text-4xl font-bold md:text-5xl">
            {heroTitle}
          </h1>

          {user && (
            <p className="mt-4 text-sm font-medium text-sky-100 md:text-base">
              Welcome back, {user.firstName}. Signed in as{" "}
              <span className="capitalize">{user.role}</span>.
            </p>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-gradient-to-br from-sky-800 via-sky-700 to-cyan-700 px-6 py-12 text-white md:px-10 lg:px-12">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur-sm">
              <MapPinned size={16} /> Accessibility-first municipal reporting
            </p>

            <h2 className="max-w-3xl text-4xl font-bold md:text-5xl">
              {isStaff
                ? "Manage accessibility issues and improve service response."
                : isAdvocate
                ? "Track trends and strengthen accessibility advocacy."
                : "Help make public spaces easier and safer for everyone to access."}
            </h2>

            <p className="mt-5 max-w-2xl text-sky-50">{heroSubtitle}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="rounded-xl bg-white px-5 py-3 font-semibold text-sky-800 hover:bg-sky-50"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-xl border border-white/30 px-5 py-3 text-white hover:bg-white/10"
                  >
                    Register
                  </Link>
                </>
              )}

              {isResident && (
                <>
                  <Link
                    to="/report"
                    className="rounded-xl bg-white px-5 py-3 font-semibold text-sky-800 hover:bg-sky-50"
                  >
                    Report an Issue
                  </Link>

                  <Link
                    to="/my-issues"
                    className="rounded-xl border border-white/30 px-5 py-3 text-white hover:bg-white/10"
                  >
                    View My Issues
                  </Link>

                  <Link
                    to="/dashboard"
                    className="rounded-xl border border-white/30 px-5 py-3 text-white hover:bg-white/10"
                  >
                    Dashboard
                  </Link>
                </>
              )}

              {isStaff && (
                <>
                  <Link
                    to="/dashboard"
                    className="rounded-xl bg-white px-5 py-3 font-semibold text-sky-800 hover:bg-sky-50"
                  >
                    Open Staff Dashboard
                  </Link>

                  <Link
                    to="/analytics"
                    className="rounded-xl border border-white/30 px-5 py-3 text-white hover:bg-white/10"
                  >
                    View Analytics
                  </Link>
                </>
              )}

              {isAdvocate && (
                <>
                  <Link
                    to="/dashboard"
                    className="rounded-xl bg-white px-5 py-3 font-semibold text-sky-800 hover:bg-sky-50"
                  >
                    Open Dashboard
                  </Link>

                  <Link
                    to="/analytics"
                    className="rounded-xl border border-white/30 px-5 py-3 text-white hover:bg-white/10"
                  >
                    View Trends
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-10 md:px-10">
            <h3 className="text-lg font-semibold text-slate-900">
              Accessibility focus areas
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="rounded-xl border bg-white px-4 py-3">
                Broken curb ramps and entrances
              </li>
              <li className="rounded-xl border bg-white px-4 py-3">
                Blocked sidewalks and unsafe detours
              </li>
              <li className="rounded-xl border bg-white px-4 py-3">
                Crosswalk signal issues
              </li>
              <li className="rounded-xl border bg-white px-4 py-3">
                Transit accessibility barriers
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {highlights.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
              <Icon size={22} />
            </div>

            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
          </div>
        ))}
      </section>
    </div>
  );
}