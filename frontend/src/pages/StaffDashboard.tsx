import { mockIssues } from "../data/mockIssues";

const stats = [
  { label: "Total Reports", value: mockIssues.length },
  { label: "High Priority", value: mockIssues.filter((i) => i.priority === "High").length },
  { label: "Resolved", value: mockIssues.filter((i) => i.status === "Resolved").length },
  { label: "Open or Active", value: mockIssues.filter((i) => i.status !== "Resolved").length },
];

const statusClasses: Record<string, string> = {
  Open: "bg-amber-100 text-amber-800",
  "In Review": "bg-sky-100 text-sky-800",
  "In Progress": "bg-violet-100 text-violet-800",
  Resolved: "bg-emerald-100 text-emerald-800",
};

export default function StaffDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Accessibility staff dashboard</h2>
        <p className="mt-2 text-sm text-slate-600">
          Monitor accessibility barriers, prioritize high-impact issues, and track service response.
        </p>
      </div>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            <p className="mt-2 text-4xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-xl font-semibold text-slate-900">Current issue queue</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Issue</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Location</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockIssues.map((issue) => (
                <tr key={issue.id} className="border-t border-slate-200">
                  <td className="px-6 py-4 font-medium text-slate-900">{issue.title}</td>
                  <td className="px-6 py-4 text-slate-600">{issue.category}</td>
                  <td className="px-6 py-4 text-slate-600">{issue.location}</td>
                  <td className="px-6 py-4 text-slate-600">{issue.priority}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[issue.status]}`}>
                      {issue.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}