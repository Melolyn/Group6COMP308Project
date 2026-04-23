import { useEffect, useMemo, useState } from "react";
import IssueFilters from "../components/dashboard/IssueFilters";
import IssuesTable from "../components/dashboard/IssuesTable";
import SummaryCards from "../components/dashboard/SummaryCards";
import { issueService } from "../services/issueService";
import type { Issue, IssueFilters as IssueFiltersType, IssueStats, IssueStatus } from "../types/issue";

const initialFilters: IssueFiltersType = {
  status: "All",
  category: "All",
  priority: "All",
  search: "",
};

const initialStats: IssueStats = {
  totalIssues: 0,
  openIssues: 0,
  inProgress: 0,
  resolved: 0,
  highPriority: 0,
  backlog: 0,
};

function recalculateStats(issues: Issue[]): IssueStats {
  return {
    totalIssues: issues.length,
    openIssues: issues.filter((issue) => issue.status === "Open").length,
    inProgress: issues.filter((issue) => issue.status === "In Progress").length,
    resolved: issues.filter((issue) => issue.status === "Resolved").length,
    highPriority: issues.filter((issue) => issue.priority === "High").length,
    backlog: issues.filter((issue) => issue.status === "Backlog").length,
  };
}

export default function StaffDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [stats, setStats] = useState<IssueStats>(initialStats);
  const [filters, setFilters] = useState<IssueFiltersType>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError(null);
        const [staffIssues, issueStats] = await Promise.all([
          issueService.getStaffIssues(),
          issueService.getIssueStats(),
        ]);
        setIssues(staffIssues);
        setStats(issueStats);
      } catch {
        setError("Unable to load staff dashboard data right now. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    void loadDashboardData();
  }, []);

  const filteredIssues = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();
    return issues.filter((issue) => {
      const matchesStatus = filters.status === "All" || issue.status === filters.status;
      const matchesCategory = filters.category === "All" || issue.category === filters.category;
      const matchesPriority = filters.priority === "All" || issue.priority === filters.priority;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        issue.title.toLowerCase().includes(normalizedSearch) ||
        issue.description.toLowerCase().includes(normalizedSearch) ||
        issue.keywords?.some((keyword) => keyword.toLowerCase().includes(normalizedSearch));
      return matchesStatus && matchesCategory && matchesPriority && Boolean(matchesSearch);
    });
  }, [filters, issues]);

  function handleStatusUpdate(issueId: string, status: IssueStatus) {
    setIssues((currentIssues) => {
      const nextIssues = currentIssues.map((issue) =>
        issue.id === issueId ? { ...issue, status, updatedAt: new Date().toISOString().split("T")[0] } : issue
      );
      setStats(recalculateStats(nextIssues));
      return nextIssues;
    });
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
        Loading staff dashboard data...
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Staff Dashboard</h2>
        <p className="mt-2 text-sm text-slate-600">Track local municipal issues, assign priorities, and manage responses.</p>
      </div>

      <SummaryCards stats={stats} />

      <IssueFilters filters={filters} issues={issues} onFilterChange={setFilters} />

      {filteredIssues.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
          No issues match your selected filters.
        </div>
      ) : (
        <IssuesTable issues={filteredIssues} onUpdateStatus={handleStatusUpdate} />
      )}
    </div>
  );
}