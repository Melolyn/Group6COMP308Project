import { mockIssues } from "../data/mockIssues";

const categoryCounts = mockIssues.reduce<Record<string, number>>((acc, issue) => {
  acc[issue.category] = (acc[issue.category] ?? 0) + 1;
  return acc;
}, {});

export default function Analytics() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Accessibility analytics</h2>
        <p className="mt-2 text-sm text-slate-600">
          A simple frontend view for issue trends and service insights.
        </p>
      </div>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Top reported categories</h3>
          <div className="mt-5 space-y-4">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <div key={category}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{category}</span>
                  <span className="text-slate-500">{count}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-sky-700"
                    style={{ width: `${Math.min(count * 25, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
          <h3 className="text-xl font-semibold">AI trend insight</h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Recent reports suggest the highest impact issues involve crossing safety, sidewalk barriers, and broken ramp access near civic buildings and busy intersections.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-300">High Priority</p>
              <p className="mt-2 text-2xl font-bold">{mockIssues.filter((i) => i.priority === "High").length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-300">Transit / Crossing</p>
              <p className="mt-2 text-2xl font-bold">
                {mockIssues.filter(
                  (i) => i.category === "Crosswalk Signal" || i.category === "Transit Access"
                ).length}
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-300">Resolved</p>
              <p className="mt-2 text-2xl font-bold">{mockIssues.filter((i) => i.status === "Resolved").length}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}