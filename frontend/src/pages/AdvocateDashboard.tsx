import { useEffect, useMemo, useState } from "react";
import { BarChart3, Bot, MapPinned, ThumbsUp, Users } from "lucide-react";
import { issueService } from "../services/issueService";
import type { Issue } from "../types/issue";

export default function AdvocateDashboard() {
  // Main issue list for advocate dashboard
  const [issues, setIssues] = useState<Issue[]>([]);

  // Page state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search and upvote interaction state
  const [searchTerm, setSearchTerm] = useState("");
  const [upvotingId, setUpvotingId] = useState<string | null>(null);

  // Load all issues when dashboard opens
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

  // Allow advocate to support an issue once only
  async function handleUpvote(issueId: string) {
    try {
      setUpvotingId(issueId);

      const updatedIssue = await issueService.upvoteIssue(issueId);

      // Replace only the updated issue in local state
      setIssues((prev) =>
        prev.map((issue) => (issue.id === issueId ? updatedIssue : issue))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to support issue");
    } finally {
      setUpvotingId(null);
    }
  }

  // Filtered issue list for search
  const filteredIssues = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return issues.filter((issue) => {
      return (
        issue.title.toLowerCase().includes(search) ||
        issue.location.toLowerCase().includes(search) ||
        issue.category.toLowerCase().includes(search)
      );
    });
  }, [issues, searchTerm]);

  // Dashboard insight calculations
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

    const mostSupportedIssue =
      [...issues].sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))[0] || null;

    const totalSupport = issues.reduce((sum, issue) => sum + (issue.upvotes || 0), 0);

    return {
      total: issues.length,
      unresolved: unresolved.length,
      topCategories,
      topLocations,
      mostSupportedIssue,
      totalSupport,
    };
  }, [issues]);

  // Recent issues for the left panel
  const recentIssues = useMemo(() => filteredIssues.slice(0, 6), [filteredIssues]);

  // Most supported issues for the engagement panel
  const mostSupportedIssues = useMemo(() => {
    return [...filteredIssues]
      .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
      .slice(0, 5);
  }, [filteredIssues]);

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
      {/* Header + search */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Community advocate dashboard
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Monitor accessibility patterns, identify recurring barriers, and support
            residents with community-focused insights.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search issue, location, or category"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-sky-600 focus:outline-none"
        />
      </div>

      {/* Top stats */}
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
          <p className="text-sm font-medium text-slate-500">Total Community Support</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">{insights.totalSupport}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        {/* Recent issue patterns with support buttons */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-xl font-semibold text-slate-900">
              Recent community issue patterns
            </h3>
          </div>

          <div className="divide-y divide-slate-200">
            {recentIssues.length === 0 ? (
              <div className="px-6 py-8 text-sm text-slate-600">
                No issue data available.
              </div>
            ) : (
              recentIssues.map((issue) => (
                <div key={issue.id} className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{issue.title}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {issue.location} · {issue.category} · {issue.priority}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        {issue.aiSummary || issue.description.slice(0, 110)}
                      </p>
                    </div>

                    {/* Support button: disabled if already supported by current advocate */}
                    <div className="flex min-w-[140px] flex-col items-end gap-2">
                      <p className="text-sm font-medium text-slate-700">
                        Support: {issue.upvotes || 0}
                      </p>

                      <button
                        onClick={() => handleUpvote(issue.id)}
                        disabled={upvotingId === issue.id || issue.supportedByCurrentUser}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition disabled:opacity-60 ${
                          issue.supportedByCurrentUser
                            ? "bg-emerald-700"
                            : "bg-sky-700 hover:bg-sky-800"
                        }`}
                      >
                        <ThumbsUp size={16} />
                        {issue.supportedByCurrentUser
                          ? "Supported"
                          : upvotingId === issue.id
                          ? "Supporting..."
                          : "Support"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Top categories */}
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

          {/* Top locations */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <MapPinned size={18} className="text-emerald-700" />
              <h3 className="text-lg font-semibold text-slate-900">
                Most affected locations
              </h3>
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

          {/* Community support insight */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Bot size={18} className="text-violet-700" />
              <h3 className="text-lg font-semibold text-slate-900">
                Community support insight
              </h3>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <p>
                Advocates can use support counts and trend patterns to highlight
                accessibility barriers that matter most to the community.
              </p>
              <p className="mt-3 font-medium text-slate-900">
                Most supported issue:{" "}
                {insights.mostSupportedIssue
                  ? `${insights.mostSupportedIssue.title} (${insights.mostSupportedIssue.upvotes || 0} supports)`
                  : "N/A"}
              </p>
            </div>
          </section>

          {/* Engagement leaderboard */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-amber-700" />
              <h3 className="text-lg font-semibold text-slate-900">
                Community engagement
              </h3>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-700">
              {mostSupportedIssues.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p>No supported issues yet.</p>
                </div>
              ) : (
                mostSupportedIssues.map((issue) => (
                  <div key={issue.id} className="rounded-2xl bg-slate-50 p-4">
                    <p className="font-medium text-slate-900">{issue.title}</p>
                    <p className="mt-1">
                      {issue.upvotes || 0} support vote(s)
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}