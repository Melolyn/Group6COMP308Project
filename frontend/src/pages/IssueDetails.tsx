import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { issueService } from "../services/issueService";
import type { Issue } from "../types/issue";

// Status badge styles
const statusClasses: Record<string, string> = {
  Open: "bg-amber-100 text-amber-800",
  "In Review": "bg-sky-100 text-sky-800",
  "In Progress": "bg-violet-100 text-violet-800",
  Resolved: "bg-emerald-100 text-emerald-800",
};

// Safe date formatter
// Returns "Not available" if the value is missing or invalid
function formatDate(value?: string) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function IssueDetails() {
  // Get issue id from route params
  const { id } = useParams();

  // Local page state
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load selected issue when page opens or id changes
  useEffect(() => {
    async function loadIssue() {
      if (!id) {
        setError("Issue ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await issueService.getIssueById(id);

        if (!data) {
          setIssue(null);
          setError("Issue not found");
          return;
        }

        setIssue(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load issue");
      } finally {
        setLoading(false);
      }
    }

    loadIssue();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
        Loading issue details...
      </div>
    );
  }

  // Error / missing issue state
  if (error || !issue) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <h2 className="text-2xl font-bold">{error || "Issue not found"}</h2>
        <Link to="/my-issues" className="mt-4 inline-block font-semibold underline">
          Return to My Issues
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Main issue details card */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* Show uploaded issue image only if one exists */}
        {issue.imageUrl && (
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="h-72 w-full object-cover"
          />
        )}

        <div className="p-8">
          {/* Category and status badges */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {issue.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                statusClasses[issue.status]
              }`}
            >
              {issue.status}
            </span>
          </div>

          {/* Main title and description */}
          <h2 className="text-3xl font-bold text-slate-900">{issue.title}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">{issue.description}</p>

          {/* Key issue metadata */}
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Location
              </p>
              <p className="mt-1 text-sm text-slate-800">{issue.location}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Priority
              </p>
              <p className="mt-1 text-sm text-slate-800">{issue.priority}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Assigned To
              </p>
              <p className="mt-1 text-sm text-slate-800">
                {issue.assignedTo || "Unassigned"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Created
              </p>
              <p className="mt-1 text-sm text-slate-800">
                {formatDate(issue.createdAt)}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Updated
              </p>
              <p className="mt-1 text-sm text-slate-800">
                {formatDate(issue.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Right-side support panel */}
      <aside className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">AI summary</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {issue.aiSummary || "No AI summary available yet."}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
          <h3 className="text-xl font-semibold">Recommended staff action</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Prioritize based on public safety, barrier severity, and impact on
            mobility independence.
          </p>
        </div>
      </aside>
    </div>
  );
}