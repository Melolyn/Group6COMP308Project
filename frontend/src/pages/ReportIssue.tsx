import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { issueService } from "../services/issueService";
import type { AccessibilityCategory } from "../types/issue";

const categories: AccessibilityCategory[] = [
  "Sidewalk Obstruction",
  "Broken Ramp",
  "Crosswalk Signal",
  "Transit Access",
  "Building Entrance",
  "Wayfinding",
  "Washroom Access",
  "Other",
];

export default function ReportIssue() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Broken Ramp" as AccessibilityCategory,
    location: "",
    priority: "Medium" as "Low" | "Medium" | "High",
    imageUrl: "",
    status: "Open" as const,
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await issueService.createIssue(form);
      navigate("/my-issues");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit issue");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold text-slate-900">Report an accessibility issue</h2>
        <p className="mt-2 text-sm text-slate-600">
          Help identify barriers affecting mobility, visibility, access, and safety.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Issue title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-sky-600 focus:outline-none"
              placeholder="Example: Broken curb ramp near library entrance"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-sky-600 focus:outline-none"
              placeholder="Describe what the issue is, who it may affect, and any safety concerns."
              required
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as AccessibilityCategory })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-sky-600 focus:outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Priority</label>
              <select
                value={form.priority}
                onChange={(e) =>
                  setForm({ ...form, priority: e.target.value as "Low" | "Medium" | "High" })
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-sky-600 focus:outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-sky-600 focus:outline-none"
              placeholder="Street address or landmark"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Image URL (optional for now)</label>
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-sky-600 focus:outline-none"
              placeholder="Paste an image link"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </form>
      </div>

      <aside className="rounded-3xl border border-slate-200 bg-slate-900 p-8 text-white shadow-sm">
        <h3 className="text-xl font-semibold">Examples of issues to report</h3>
        <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
          <li>Blocked curb ramps or entrances</li>
          <li>Broken tactile paving or sidewalk hazards</li>
          <li>Crosswalk audio signal failures</li>
          <li>Missing accessible signs or wayfinding directions</li>
          <li>Inaccessible transit stop infrastructure</li>
        </ul>
      </aside>
    </div>
  );
}