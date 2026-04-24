import type { Issue, IssueCategory, IssuePriority, IssueStatus } from "../../types/issue";

interface IssueFilters {
  status: "All" | IssueStatus;
  category: "All" | IssueCategory;
  priority: "All" | IssuePriority;
  search: string;
}

interface IssueFiltersProps {
  filters: IssueFilters;
  issues: Issue[];
  onFilterChange: (nextFilters: IssueFilters) => void;
}

export default function IssueFilters({ filters, issues, onFilterChange }: IssueFiltersProps) {
  const statusOptions = Array.from(new Set(issues.map((issue) => issue.status)));
  const categoryOptions = Array.from(new Set(issues.map((issue) => issue.category)));
  const priorityOptions = Array.from(new Set(issues.map((issue) => issue.priority)));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm">
          <span className="mb-2 block font-medium text-slate-700">Status</span>
          <select
            value={filters.status}
            onChange={(event) =>
              onFilterChange({ ...filters, status: event.target.value as "All" | IssueStatus })
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 focus:border-sky-600 focus:outline-none"
          >
            <option value="All">All</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-2 block font-medium text-slate-700">Category</span>
          <select
            value={filters.category}
            onChange={(event) =>
              onFilterChange({ ...filters, category: event.target.value as "All" | IssueCategory })
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 focus:border-sky-600 focus:outline-none"
          >
            <option value="All">All</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-2 block font-medium text-slate-700">Priority</span>
          <select
            value={filters.priority}
            onChange={(event) =>
              onFilterChange({ ...filters, priority: event.target.value as "All" | IssuePriority })
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 focus:border-sky-600 focus:outline-none"
          >
            <option value="All">All</option>
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-2 block font-medium text-slate-700">Search</span>
          <input
            value={filters.search}
            onChange={(event) => onFilterChange({ ...filters, search: event.target.value })}
            placeholder="Search title or keyword"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-sky-600 focus:outline-none"
          />
        </label>
      </div>
    </section>
  );
}
