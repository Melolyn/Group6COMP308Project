import { useEffect, useMemo, useState } from "react";
import { issueService } from "../services/issueService";
import type { Issue } from "../types/issue";

type AppUserRole = "resident" | "staff" | "advocate";

type StoredUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AppUserRole;
};

function getCurrentUser(): StoredUser | null {
  const raw = localStorage.getItem("civicai_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export default function Analytics() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = getCurrentUser();
  const isStaff = user?.role === "staff";
  const isAdvocate = user?.role === "advocate";

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError("");
        const data = await issueService.getAllIssues();
        setIssues(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const categoryCounts = useMemo(() => {
    return issues.reduce<Record<string, number>>((acc, issue) => {
      acc[issue.category] = (acc[issue.category] ?? 0) + 1;
      return acc;
    }, {});
  }, [issues]);

  const locationCounts = useMemo(() => {
    return issues.reduce<Record<string, number>>((acc, issue) => {
      acc[issue.location] = (acc[issue.location] ?? 0) + 1;
      return acc;
    }, {});
  }, [issues]);

  const highPriorityCount = useMemo(
    () => issues.filter((i) => i.priority === "High").length,
    [issues]
  );

  const transitCrossingCount = useMemo(
    () =>
      issues.filter(
        (i) => i.category === "Crosswalk Signal" || i.category === "Transit Access"
      ).length,
    [issues]
  );

  const resolvedCount = useMemo(
    () => issues.filter((i) => i.status === "Resolved").length,
    [issues]
  );

  const unresolvedCount = useMemo(
    () => issues.filter((i) => i.status !== "Resolved").length,
    [issues]
  );

  const inProgressCount = useMemo(
    () =>
      issues.filter(
        (i) => i.status === "In Review" || i.status === "In Progress"
      ).length,
    [issues]
  );

  const topCategories = useMemo(() => {
    return Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [categoryCounts]);

  const topLocations = useMemo(() => {
    return Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [locationCounts]);

  const aiTrendInsight = useMemo(() => {
    if (issues.length === 0) {
      return "No issue data is available yet. Submit reports to generate insights.";
    }

    const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    const sortedLocations = Object.entries(locationCounts).sort((a, b) => b[1] - a[1]);

    const topCategory = sortedCategories[0]?.[0];
    const topLocation = sortedLocations[0]?.[0];

    if (!topCategory) {
      return "Issue trends will appear here once reports are submitted.";
    }

    if (isStaff) {
      return `Operational trend insight: ${topCategory} is currently the most reported issue category. ${
        topLocation ? `${topLocation} appears to be the most affected area. ` : ""
      }Staff should prioritize unresolved high-priority barriers and reduce the active backlog.`;
    }

    if (isAdvocate) {
      return `Community trend insight: residents are reporting ${topCategory} most often. ${
        topLocation ? `${topLocation} appears frequently in issue reports. ` : ""
      }This suggests an opportunity for targeted awareness, support, and advocacy around recurring accessibility barriers.`;
    }

    return `Current reports suggest the main accessibility pressure points are ${sortedCategories
      .slice(0, 3)
      .map(([category]) => category)
      .join(", ")}. High-impact mobility and crossing barriers should be monitored closely.`;
  }, [issues, categoryCounts, locationCounts, isStaff, isAdvocate]);

  const pageTitle = isStaff
    ? "Operational analytics"
    : isAdvocate
    ? "Community accessibility insights"
    : "Accessibility analytics";

  const pageSubtitle = isStaff
    ? "Monitor backlog, high-priority barriers, and service response performance."
    : isAdvocate
    ? "Track recurring accessibility barriers and identify community support priorities."
    : "A live view of issue trends and service insights.";

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
        <h2 className="text-2xl font-bold">Analytics Error</h2>
        <p className="mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">{pageTitle}</h2>
        <p className="mt-2 text-sm text-slate-600">{pageSubtitle}</p>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Reports</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">{issues.length}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            {isAdvocate ? "Unresolved Barriers" : "High Priority"}
          </p>
          <p className="mt-2 text-4xl font-bold text-amber-700">
            {isAdvocate ? unresolvedCount : highPriorityCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            {isAdvocate ? "Transit / Crossing" : "In Review / Progress"}
          </p>
          <p className="mt-2 text-4xl font-bold text-sky-700">
            {isAdvocate ? transitCrossingCount : inProgressCount}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Resolved</p>
          <p className="mt-2 text-4xl font-bold text-emerald-700">{resolvedCount}</p>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Top reported categories</h3>

          {topCategories.length === 0 ? (
            <p className="mt-5 text-sm text-slate-600">No category data available yet.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {topCategories.map(([category, count]) => (
                <div key={category}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{category}</span>
                    <span className="text-slate-500">{count}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-sky-700"
                      style={{
                        width: `${Math.min((count / Math.max(issues.length, 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Most affected locations</h3>

          {topLocations.length === 0 ? (
            <p className="mt-5 text-sm text-slate-600">No location data available yet.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {topLocations.map(([location, count]) => (
                <div key={location}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{location}</span>
                    <span className="text-slate-500">{count}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-emerald-600"
                      style={{
                        width: `${Math.min((count / Math.max(issues.length, 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
          <h3 className="text-xl font-semibold">AI trend insight</h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">{aiTrendInsight}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-300">High Priority</p>
              <p className="mt-2 text-2xl font-bold">{highPriorityCount}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-300">Unresolved</p>
              <p className="mt-2 text-2xl font-bold">{unresolvedCount}</p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-300">Resolved</p>
              <p className="mt-2 text-2xl font-bold">{resolvedCount}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">
            {isStaff ? "Operational focus" : "Community focus"}
          </h3>

          <div className="mt-4 space-y-3 text-sm text-slate-700">
            {isStaff ? (
              <>
                <div className="rounded-2xl bg-slate-50 p-4">
                  Prioritize unresolved high-priority accessibility barriers first.
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  Use backlog and category patterns to assign faster response effort.
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  Track high-volume locations for service planning and escalation.
                </div>
              </>
            ) : (
              <>
                <div className="rounded-2xl bg-slate-50 p-4">
                  Monitor recurring accessibility barriers affecting residents most often.
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  Use location patterns to support awareness and targeted advocacy.
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  Highlight persistent community concerns that remain unresolved.
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}