import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DistributionPoint } from "../../types/issue";
import ChartCard from "./ChartCard";

interface CategoryChartProps {
  data: DistributionPoint[];
}

export default function CategoryChart({ data }: CategoryChartProps) {
  return (
    <ChartCard title="Category Distribution" subtitle="Most reported municipal issue types.">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={65} tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
