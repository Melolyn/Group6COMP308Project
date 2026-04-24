import { useEffect, useMemo, useState } from "react";
import { issueService } from "../services/issueService";
import type { Issue, IssueStatus } from "../types/issue";

// Status badge color classes
const statusClasses: Record<string, string> = {
  Open: "bg-amber-100 text-amber-800",
  "In Review": "bg-sky-100 text-sky-800",
  "In Progress": "bg-violet-100 text-violet-800",
  Resolved: "bg-emerald-100 text-emerald-800",
};

// Priority badge color classes
const priorityClasses: Record<string, string> = {
  High: "bg-rose-100 text-rose-800",
  Medium: "bg-amber-100 text-amber-800",
  Low: "bg-emerald-100 text-emerald-800",
};

// Available issue status options for staff updates
const statusOptions: IssueStatus[] = [
  "Open",
  "In Review",
  "In Progress",
  "Resolved",
];

// Team-based assignment options
const assigneeOptions = [
  "Unassigned",
  "Accessibility Team",
  "Road Safety Team",
  "Transit Accessibility Unit",
  "Municipal Maintenance",
];

export default function StaffDashboard() {
  // Main issue dataset
  const [issues, setIssues] = useState<Issue[]>([]);

  // Loading and error UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Track which issue is being updated so we can disable only that dropdown
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | IssueStatus>("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | Issue["priority"]>("All");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("All");

  // Load all issues once when dashboard mounts
  useEffect(() => {
    async function loadIssues() {
      try {
        setLoading(true);
        setError("");
        const data = await issueService.getAllIssues();
        setIssues(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadIssues();
  }, []);

  // Update issue status from the status dropdown
  async function handleStatusChange(issueId: string, newStatus: string) {
    try {
      setUpdatingId(issueId);

      const updatedIssue = await issueService.updateIssueStatus(
        issueId,
        newStatus as IssueStatus
      );

      // Replace only the updated issue inside local state
      setIssues((prev) =>
        prev.map((issue) => (issue.id === issueId ? updatedIssue : issue))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  // Assign issue to a municipal team
  async function handleAssignIssue(issueId: string, assignedTo: string) {
    try {
      setAssigningId(issueId);

      const updatedIssue = await issueService.assignIssue(issueId, assignedTo);

      // Replace only the updated issue inside local state
      setIssues((prev) =>
        prev.map((issue) => (issue.id === issueId ? updatedIssue : issue))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to assign issue");
    } finally {
      setAssigningId(null);
    }
  }

  // Build assignee filter options dynamically from loaded issues
  const assigneeOptionsForFilter = useMemo(() => {
    const values = Array.from(
      new Set(issues.map((issue) => issue.assignedTo || "Unassigned"))
    );
    return ["All", ...values];
  }, [issues]);

  // Main filtered issue list used in the table
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch =
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.assignedTo || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ? true : issue.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ? true : issue.priority === priorityFilter;

      const issueAssignee = issue.assignedTo || "Unassigned";
      const matchesAssignee =
        assigneeFilter === "All" ? true : issueAssignee === assigneeFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
    });
  }, [issues, searchTerm, statusFilter, priorityFilter, assigneeFilter]);

  // Municipal-focused dashboard stats
  const stats = useMemo(() => {
    return [
      { label: "Total Reports", value: issues.length },
      {
        label: "Unassigned",
        value: issues.filter(
          (issue) =>
            (!issue.assignedTo || issue.assignedTo === "Unassigned") &&
            issue.status !== "Resolved"
        ).length,
      },
      {
        label: "High Priority",
        value: issues.filter(
          (issue) => issue.priority === "High" && issue.status !== "Resolved"
        ).length,
      },
      {
        label: "Resolved",
        value: issues.filter((issue) => issue.status === "Resolved").length,
      },
    ];
  }, [issues]);

  // High-priority unresolved issues
  const urgentIssues = useMemo(() => {
    return issues.filter(
      (issue) => issue.priority === "High" && issue.status !== "Resolved"
    );
  }, [issues]);

  // Issues that still need assignment
  const unassignedIssues = useMemo(() => {
    return issues.filter(
      (issue) =>
        (!issue.assignedTo || issue.assignedTo === "Unassigned") &&
        issue.status !== "Resolved"
    );
  }, [issues]);

  // Issues already assigned to a team and still active
  const assignedIssues = useMemo(() => {
    return issues.filter(
      (issue) =>
        issue.assignedTo &&
        issue.assignedTo !== "Unassigned" &&
        issue.status !== "Resolved"
    );
  }, [issues]);

  // Simple insights for category, location, and backlog
  const issueInsights = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    const locationCount: Record<string, number> = {};

    issues.forEach((issue) => {
      categoryCount[issue.category] = (categoryCount[issue.category] || 0) + 1;
      locationCount[issue.location] = (locationCount[issue.location] || 0) + 1;
    });

    const topCategory =
      Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    const topLocation =
      Object.entries(locationCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

    return {
      topCategory,
      topLocation,
      activeBacklog: issues.filter((issue) => issue.status !== "Resolved").length,
    };
  }, [issues]);

  // Loading state
  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
        Loading dashboard...
      </div>
    );
  }

  // Error state
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
      {/* Header + filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Accessibility staff dashboard
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Manage reported accessibility barriers, update issue progress, and use
            AI-supported insights to prioritize response.
          </p>
        </div>

        {/* Search and filter controls */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="text"
            placeholder="Search issue, category, location, or assignee"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-sky-600 focus:outline-none"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "All" | IssueStatus)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-sky-600 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as "All" | Issue["priority"])
            }
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-sky-600 focus:outline-none"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-sky-600 focus:outline-none"
          >
            {assigneeOptionsForFilter.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee === "All" ? "All Assignees" : assignee}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats cards */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-2 text-4xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Main content area */}
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Issue table */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-4">
            <h3 className="text-xl font-semibold text-slate-900">Current issue queue</h3>
            <p className="mt-1 text-sm text-slate-500">
              Filter, review, update, and assign reported accessibility issues.
            </p>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="px-6 py-8 text-sm text-slate-600">
              No issues match the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Issue</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Location</th>
                    <th className="px-6 py-4 font-semibold">Priority</th>
                    <th className="px-6 py-4 font-semibold">Assigned To</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Assign Issue</th>
                    <th className="px-6 py-4 font-semibold">Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIssues.map((issue) => (
                    <tr key={issue.id} className="border-t border-slate-200">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{issue.title}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {issue.aiSummary || issue.description.slice(0, 90)}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-slate-600">{issue.category}</td>
                      <td className="px-6 py-4 text-slate-600">{issue.location}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            priorityClasses[issue.priority] || "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {issue.priority}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {issue.assignedTo || "Unassigned"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            statusClasses[issue.status] || "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {issue.status}
                        </span>
                      </td>

                      {/* Team assignment dropdown */}
                      <td className="px-6 py-4">
                        <select
                          value={issue.assignedTo || "Unassigned"}
                          onChange={(e) => handleAssignIssue(issue.id, e.target.value)}
                          disabled={assigningId === issue.id}
                          className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-sky-600 focus:outline-none disabled:opacity-60"
                        >
                          {assigneeOptions.map((assignee) => (
                            <option key={assignee} value={assignee}>
                              {assignee}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Status update dropdown */}
                      <td className="px-6 py-4">
                        <select
                          value={issue.status}
                          onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                          disabled={updatingId === issue.id}
                          className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-sky-600 focus:outline-none disabled:opacity-60"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right-side insights and queues */}
        <div className="space-y-6">
          {/* Urgent issues queue */}
          <section className="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-rose-900">Urgent response queue</h3>
            <p className="mt-1 text-sm text-rose-700">
              High-priority issues still awaiting resolution.
            </p>

            <div className="mt-4 space-y-3">
              {urgentIssues.length === 0 ? (
                <p className="text-sm text-rose-700">No urgent unresolved issues right now.</p>
              ) : (
                urgentIssues.slice(0, 5).map((issue) => (
                  <div key={issue.id} className="rounded-2xl bg-white/80 p-4">
                    <p className="font-semibold text-slate-900">{issue.title}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {issue.location} · {issue.category}
                    </p>
                    <p className="mt-2 text-xs text-rose-700">
                      Priority: {issue.priority} · Status: {issue.status}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Assigned To: {issue.assignedTo || "Unassigned"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Unassigned queue */}
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-amber-900">Unassigned issues</h3>
            <p className="mt-1 text-sm text-amber-700">
              Reports that still need team ownership.
            </p>

            <div className="mt-4 space-y-3">
              {unassignedIssues.length === 0 ? (
                <p className="text-sm text-amber-700">No unassigned active issues.</p>
              ) : (
                unassignedIssues.slice(0, 5).map((issue) => (
                  <div key={issue.id} className="rounded-2xl bg-white/80 p-4">
                    <p className="font-semibold text-slate-900">{issue.title}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {issue.location} · {issue.category}
                    </p>
                    <p className="mt-2 text-xs text-amber-700">
                      Priority: {issue.priority} · Status: {issue.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Assigned queue */}
          <section className="rounded-3xl border border-sky-200 bg-sky-50 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-sky-900">Assigned issues</h3>
            <p className="mt-1 text-sm text-sky-700">
              Active reports currently assigned to municipal teams.
            </p>

            <div className="mt-4 space-y-3">
              {assignedIssues.length === 0 ? (
                <p className="text-sm text-sky-700">No assigned active issues.</p>
              ) : (
                assignedIssues.slice(0, 5).map((issue) => (
                  <div key={issue.id} className="rounded-2xl bg-white/80 p-4">
                    <p className="font-semibold text-slate-900">{issue.title}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {issue.location} · {issue.category}
                    </p>
                    <p className="mt-2 text-xs text-sky-700">
                      Assigned To: {issue.assignedTo} · Status: {issue.status}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* AI-supported insights */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">AI-supported queue insights</h3>
            <div className="mt-4 space-y-4 text-sm text-slate-700">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-900">Top reported category</p>
                <p className="mt-1">{issueInsights.topCategory}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-900">Most affected location</p>
                <p className="mt-1">{issueInsights.topLocation}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-medium text-slate-900">Active backlog</p>
                <p className="mt-1">
                  {issueInsights.activeBacklog} issue(s) still require action.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}