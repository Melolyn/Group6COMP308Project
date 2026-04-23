import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { DistributionPoint } from "../../types/issue";
import ChartCard from "./ChartCard";

interface StatusChartProps {
  data: DistributionPoint[];
}

const COLORS = ["#f59e0b", "#6366f1", "#10b981", "#64748b"];

export default function StatusChart({ data }: StatusChartProps) {
  return (
    <ChartCard title="Status Distribution" subtitle="Open, in progress, resolved, and backlog breakdown.">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="name" outerRadius={95} label>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
