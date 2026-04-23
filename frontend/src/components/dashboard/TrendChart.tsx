import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { IssueTrendPoint } from "../../types/issue";
import ChartCard from "./ChartCard";

interface TrendChartProps {
  data: IssueTrendPoint[];
  mode: "reportedVsResolved" | "backlog";
}

export default function TrendChart({ data, mode }: TrendChartProps) {
  const isBacklog = mode === "backlog";
  const title = isBacklog ? "Backlog Trend" : "Issue Trend Over Time";
  const subtitle = isBacklog
    ? "Running open and backlog volume across reporting dates."
    : "Reported versus resolved issues over time.";

  return (
    <ChartCard title={title} subtitle={subtitle}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          {isBacklog ? (
            <>
              <Line type="monotone" dataKey="open" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="backlog" stroke="#475569" strokeWidth={2} dot={false} />
            </>
          ) : (
            <>
              <Line type="monotone" dataKey="reported" stroke="#0284c7" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="resolved" stroke="#16a34a" strokeWidth={2} dot={false} />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
