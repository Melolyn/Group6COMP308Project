import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { issueService } from "../services/issueService";
import type { Issue } from "../types/issue";

const statusClasses: Record<string, string> = {
  Open: "bg-amber-100 text-amber-800",
  "In Review": "bg-sky-100 text-sky-800",
  "In Progress": "bg-violet-100 text-violet-800",
  Resolved: "bg-emerald-100 text-emerald-800",
};

export default function UserIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadIssues() {
      try {
        setLoading(true);
        const data = await issueService.getMyIssues();
        setIssues(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load issues");
      } finally {
        setLoading(false);
      }
    }

    loadIssues();
  }, []);

  if (loading) {
    return <p className="text-slate-600">Loading your issues...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">My reported issues</h2>
        <p className="mt-2 text-sm text-slate-600">
          Track the accessibility concerns you have submitted.
        </p>
      </div>

      {issues.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
          No issues reported yet.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {issues.map((issue) => (
            <article
              key={issue.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              {issue.imageUrl && (
                <img src={issue.imageUrl} alt={issue.title} className="h-52 w-full object-cover" />
              )}

              <div className="p-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {issue.category}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[issue.status]}`}
                  >
                    {issue.status}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-slate-900">{issue.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{issue.description}</p>

                <div className="mt-4 space-y-1 text-sm text-slate-500">
                  <p><strong>Location:</strong> {issue.location}</p>
                  <p><strong>Priority:</strong> {issue.priority}</p>
                  <p><strong>Reported:</strong> {new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>

                <Link
                  to={`/issue/${issue.id}`}
                  className="mt-5 inline-flex rounded-xl bg-sky-700 px-4 py-2 font-semibold text-white transition hover:bg-sky-800"
                >
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}