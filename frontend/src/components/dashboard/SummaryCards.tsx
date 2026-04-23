import type { IssueStats } from "../../types/issue";

interface SummaryCardsProps {
  stats: IssueStats;
}

const cardConfig: Array<{ key: keyof IssueStats; label: string; tone: string }> = [
  { key: "totalIssues", label: "Total Issues", tone: "text-slate-900" },
  { key: "openIssues", label: "Open Issues", tone: "text-amber-700" },
  { key: "inProgress", label: "In Progress", tone: "text-indigo-700" },
  { key: "resolved", label: "Resolved", tone: "text-emerald-700" },
  { key: "highPriority", label: "High Priority", tone: "text-rose-700" },
  { key: "backlog", label: "Backlog", tone: "text-slate-700" },
];

export default function SummaryCards({ stats }: SummaryCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cardConfig.map((card) => (
        <article key={card.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className={`mt-2 text-3xl font-bold ${card.tone}`}>{stats[card.key]}</p>
        </article>
      ))}
    </section>
  );
}
