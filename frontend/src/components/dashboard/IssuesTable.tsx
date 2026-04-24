import { Link } from "react-router-dom";
import type { Issue, IssueStatus } from "../../types/issue";

interface IssuesTableProps {
  issues: Issue[];
  onUpdateStatus: (issueId: string, status: IssueStatus) => void;
}

const statusClasses: Record<IssueStatus | "Backlog", string> = {
  Open: "bg-amber-100 text-amber-800",
  "In Review": "bg-sky-100 text-sky-800",
  "In Progress": "bg-indigo-100 text-indigo-800",
  Resolved: "bg-emerald-100 text-emerald-800",
  Backlog: "bg-slate-200 text-slate-700",
};

export default function IssuesTable({ issues, onUpdateStatus }: IssuesTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Priority</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Created At</th>
              <th className="px-4 py-3 font-semibold">Assigned To</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} className="border-t border-slate-200 align-top">
                <td className="px-4 py-3 font-medium text-slate-900">{issue.title}</td>
                <td className="px-4 py-3 text-slate-600">{issue.category}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[issue.status]}`}>
                    {issue.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{issue.priority}</td>
                <td className="px-4 py-3 text-slate-600">{issue.location}</td>
                <td className="px-4 py-3 text-slate-600">{issue.createdAt}</td>
                <td className="px-4 py-3 text-slate-600">{issue.assignedTo ?? "Unassigned"}</td>
                <td className="px-4 py-3">
                  <div className="flex min-w-[220px] flex-wrap gap-2">
                    <Link
                      to={`/issue/${issue.id}`}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View Details
                    </Link>
                    <select
                      value={issue.status}
                      onChange={(event) => onUpdateStatus(issue.id, event.target.value as IssueStatus)}
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs text-slate-700 focus:border-sky-600 focus:outline-none"
                      aria-label={`Update status for ${issue.title}`}
                    >
                      <option value="Open">Open</option>
                      <option value="In Review">In Review</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Backlog">Backlog</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
