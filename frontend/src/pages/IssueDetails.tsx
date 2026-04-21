import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { mockIssues } from "../data/mockIssues";

const statusClasses: Record<string, string> = {
  Open: "bg-amber-100 text-amber-800",
  "In Review": "bg-sky-100 text-sky-800",
  "In Progress": "bg-violet-100 text-violet-800",
  Resolved: "bg-emerald-100 text-emerald-800",
};

export default function IssueDetails() {
  const { id } = useParams();

  const issue = useMemo(() => mockIssues.find((item) => item.id === id), [id]);

  if (!issue) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <h2 className="text-2xl font-bold">Issue not found</h2>
        <Link to="/my-issues" className="mt-4 inline-block font-semibold underline">
          Return to My Issues
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {issue.imageUrl && <img src={issue.imageUrl} alt={issue.title} className="h-72 w-full object-cover" />}
        <div className="p-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {issue.category}
            </span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[issue.status]}`}>
              {issue.status}
            </span>
          </div>

          <h2 className="text-3xl font-bold text-slate-900">{issue.title}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{issue.description}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</p>
              <p className="mt-1 text-sm text-slate-800">{issue.location}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Priority</p>
              <p className="mt-1 text-sm text-slate-800">{issue.priority}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Created</p>
              <p className="mt-1 text-sm text-slate-800">{issue.createdAt}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Updated</p>
              <p className="mt-1 text-sm text-slate-800">{issue.updatedAt}</p>
            </div>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">AI summary</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">{issue.aiSummary}</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
          <h3 className="text-xl font-semibold">Recommended staff action</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Prioritize based on public safety, barrier severity, and impact on mobility independence.
          </p>
        </div>
      </aside>
    </div>
  );
}