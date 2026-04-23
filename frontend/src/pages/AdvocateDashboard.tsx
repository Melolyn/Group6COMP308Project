import { useEffect, useMemo, useState } from "react";
import { BarChart3, Bot, MapPinned, Users } from "lucide-react";
import { issueService } from "../services/issueService";
import type { Issue } from "../types/issue";

export default function AdvocateDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadIssues() {
      try {
        setLoading(true);
        setError("");
        const data = await issueService.getAllIssues();
        setIssues(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load advocate dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadIssues();
  }, []);

  const insights = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    const locationCount: Record<string, number> = {};
    const unresolved = issues.filter((issue) => issue.status !== "Resolved");

    issues.forEach((issue) => {
      categoryCount[issue.category] = (categoryCount[issue.category] || 0) + 1;
      locationCount[issue.location] = (locationCount[issue.location] || 0) + 1;
    });

    const topCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const topLocations = Object.entries(locationCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    return {
      total: issues.length,
      unresolved: unresolved.length,
      topCategories,
      topLocations,
    };
  }, [issues]);

  const recentIssues = useMemo(() => issues.slice(0, 6), [issues]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
        Loading advocate dashboard...
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
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Community advocate dashboard</h2>
        <p className="mt-2 text-sm text-slate-600">
          Monitor accessibility patterns, identify recurring barriers, and support residents with community-focused insights.
        </p>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Reported Issues</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">{insights.total}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Unresolved</p>
          <p className="mt-2 text-4xl font-bold text-amber-700">{insights.unresolved}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Top Category</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {insights.topCategories[0]?.[0] || "N/A"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Most Affected Area</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {insights.topLocations[0]?.[0] || "N/A"}
          </p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-xl font-semibold text-slate-900">Recent community issue patterns</h3>
          </div>

          <div className="divide-y divide-slate-200">
            {recentIssues.length === 0 ? (
              <div className="px-6 py-8 text-sm text-slate-600">No issue data available.</div>
            ) : (
              recentIssues.map((issue) => (
                <div key={issue.id} className="px-6 py-5">
                  <p className="font-semibold text-slate-900">{issue.title}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    {issue.location} · {issue.category} · {issue.priority}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {issue.aiSummary || issue.description.slice(0, 110)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-sky-700" />
              <h3 className="text-lg font-semibold text-slate-900">Trend snapshot</h3>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-700">
              {insights.topCategories.map(([name, count]) => (
                <div key={name} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">{name}</p>
                  <p className="mt-1">{count} reported issue(s)</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPinned size={18} className="text-emerald-700" />
              <h3 className="text-lg font-semibold text-slate-900">Most affected locations</h3>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-700">
              {insights.topLocations.map(([name, count]) => (
                <div key={name} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">{name}</p>
                  <p className="mt-1">{count} reported issue(s)</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-violet-700" />
              <h3 className="text-lg font-semibold text-slate-900">Community support insight</h3>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <p>
                Advocates can use these patterns to raise awareness, support residents with recurring
                accessibility barriers, and escalate persistent location-based concerns.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-amber-700" />
              <h3 className="text-lg font-semibold text-slate-900">Engagement note</h3>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <p>
                Community advocate tools such as comments, upvotes, and volunteer coordination can be
                added as a future enhancement layer.
              </p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}