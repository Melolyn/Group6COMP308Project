import ChartCard from "./ChartCard";

export default function HeatmapPlaceholder() {
  return (
    <ChartCard
      title="Issue Heatmap (Coming Soon)"
      subtitle="Geographic hotspot visualization will be connected once map data is available."
    >
      <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-700">Map integration placeholder</p>
          <p className="mt-1 text-xs text-slate-500">Future: density of potholes, flooding, and safety hazards.</p>
        </div>
      </div>
    </ChartCard>
  );
}
