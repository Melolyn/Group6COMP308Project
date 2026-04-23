import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { BellRing, ClipboardList, ShieldCheck, TriangleAlert } from "lucide-react";
import { issueService } from "../services/issueService";
import type { Issue } from "../types/issue";

const statusClasses: Record<string, string> = {
  Open: "bg-amber-100 text-amber-800",
  "In Review": "bg-sky-100 text-sky-800",
  "In Progress": "bg-violet-100 text-violet-800",
  Resolved: "bg-emerald-100 text-emerald-800",
};

export default function ResidentDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMyIssues() {
      try {
        setLoading(true);
        setError("");
        const data = await issueService.getMyIssues();
        setIssues(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load resident dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadMyIssues();
  }, []);

  const stats = useMemo(() => {
    return {
      total: issues.length,
      open: issues.filter((issue) => issue.status === "Open").length,
      active: issues.filter(
        (issue) => issue.status === "In Review" || issue.status === "In Progress"
      ).length,
      resolved: issues.filter((issue) => issue.status === "Resolved").length,
    };
  }, [issues]);

  const recentIssues = useMemo(() => issues.slice(0, 5), [issues]);

  const alertIssues = useMemo(() => {
    return issues.filter(
      (issue) => issue.priority === "High" && issue.status !== "Resolved"
    );
  }, [issues]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
        Loading resident dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <h2 className="text-2xl font-bold">Dashboard Error</h2>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Resident dashboard</h2>
          <p className="mt-2 text-sm text-slate-600">
            Track your reported accessibility issues, view important updates, and take quick action.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/report"
            className="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white hover:bg-sky-800"
          >
            Report New Issue
          </Link>
          <Link
            to="/my-issues"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            View All My Issues
          </Link>
        </div>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Reported</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">{stats.total}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Open</p>
          <p className="mt-2 text-4xl font-bold text-amber-700">{stats.open}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">In Review / Progress</p>
          <p className="mt-2 text-4xl font-bold text-sky-700">{stats.active}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Resolved</p>
          <p className="mt-2 text-4xl font-bold text-emerald-700">{stats.resolved}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-xl font-semibold text-slate-900">Recent issue activity</h3>
          </div>

          {recentIssues.length === 0 ? (
            <div className="px-6 py-8 text-sm text-slate-600">
              You have not reported any issues yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {recentIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="text-lg font-semibold text-slate-900">{issue.title}</h4>
                    <p className="text-sm text-slate-600">{issue.location}</p>
                    <p className="text-sm text-slate-500">
                      Category: {issue.category} · Priority: {issue.priority}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusClasses[issue.status] || "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {issue.status}
                    </span>

                    <Link
                      to={`/issue/${issue.id}`}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <BellRing size={18} className="text-amber-700" />
              <h3 className="text-lg font-semibold text-amber-900">Alerts & updates</h3>
            </div>

            <div className="mt-4 space-y-3 text-sm text-amber-800">
              {alertIssues.length === 0 ? (
                <p>No urgent alerts on your reported issues right now.</p>
              ) : (
                alertIssues.slice(0, 4).map((issue) => (
                  <div key={issue.id} className="rounded-2xl bg-white/80 p-4">
                    <p className="font-semibold text-slate-900">{issue.title}</p>
                    <p className="mt-1 text-slate-600">
                      High-priority issue still awaiting resolution.
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Quick support</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <ClipboardList size={18} className="mt-0.5 text-sky-700" />
                <p>Submit a new report if the barrier affects safety, mobility, or access.</p>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <ShieldCheck size={18} className="mt-0.5 text-emerald-700" />
                <p>Track statuses as staff review and resolve your submitted issues.</p>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                <TriangleAlert size={18} className="mt-0.5 text-amber-700" />
                <p>Watch urgent issues closely if they remain high priority and unresolved.</p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}