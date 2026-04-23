import { useEffect, useState } from "react";
import CategoryChart from "../components/dashboard/CategoryChart";
import HeatmapPlaceholder from "../components/dashboard/HeatmapPlaceholder";
import StatusChart from "../components/dashboard/StatusChart";
import TrendChart from "../components/dashboard/TrendChart";
import { analyticsService } from "../services/analyticsService";
import type { IssueAnalyticsData } from "../types/issue";

const emptyAnalyticsData: IssueAnalyticsData = {
  statusDistribution: [],
  categoryDistribution: [],
  trend: [],
};

export default function Analytics() {
  const [analytics, setAnalytics] = useState<IssueAnalyticsData>(emptyAnalyticsData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        setError(null);
        const data = await analyticsService.getAnalyticsData();
        setAnalytics(data);
      } catch {
        setError("Unable to load analytics right now. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    void loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-sm font-medium text-rose-700 shadow-sm">
        {error}
      </div>
    );
  }

  if (
    analytics.statusDistribution.length === 0 &&
    analytics.categoryDistribution.length === 0 &&
    analytics.trend.length === 0
  ) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
        No analytics data available yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Staff Analytics</h2>
        <p className="mt-2 text-sm text-slate-600">
          Analyze municipal service demand, issue lifecycle, and response outcomes.
        </p>
      </div>

      <section className="grid gap-5 xl:grid-cols-2">
        <StatusChart data={analytics.statusDistribution} />
        <CategoryChart data={analytics.categoryDistribution} />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <TrendChart data={analytics.trend} mode="reportedVsResolved" />
        <TrendChart data={analytics.trend} mode="backlog" />
      </section>

      <HeatmapPlaceholder />
    </div>
  );
}