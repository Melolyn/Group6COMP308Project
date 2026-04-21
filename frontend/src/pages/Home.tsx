import { Link } from "react-router-dom";
import {
  Accessibility,
  BellRing,
  Bot,
  MapPinned,
  ShieldCheck,
} from "lucide-react";

import picture from "../assets/picture.jpg";

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

export default function Home() {
  return (
    
    <div className="space-y-10">
            <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-3xl">
            {/* Background Image */}
            <img
                src={picture}
                alt="Accessibility pathway with wheelchair user"
                className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Overlay */}
             <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-12 text-white">
                <h1 className="text-4xl md:text-5xl font-bold max-w-2xl">
                Building a more accessible city starts with you.
                </h1>

                
            </div>
            </section>
      {/* HERO */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-gradient-to-br from-sky-800 via-sky-700 to-cyan-700 px-6 py-12 text-white md:px-10 lg:px-12">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm font-medium backdrop-blur-sm">
              <MapPinned size={16} /> Accessibility-first municipal reporting
            </p>

            <h2 className="max-w-3xl text-4xl font-bold md:text-5xl">
              Help make public spaces easier and safer for everyone to access.
            </h2>

            <p className="mt-5 max-w-2xl text-sky-50">
              Report barriers, follow issue progress, and support a more inclusive
              city through accessible service design.
            </p>

            <div className="mt-8 flex gap-3">
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
            </div>
          </div>

          {/* SIDE PANEL */}
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

      {/* FEATURES */}
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