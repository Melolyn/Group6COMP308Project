import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🔥 Get user back from login (IMPORTANT)
      const user = await authService.login({ email, password });

      // 🔥 Redirect based on role (lowercase roles)
      if (user.role === "resident") {
        navigate("/my-issues");
      } else if (user.role === "staff") {
        navigate("/staff-dashboard");
      } else if (user.role === "advocate") {
        navigate("/community-dashboard");
      } else {
        // fallback (just in case)
        navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-3xl font-bold text-slate-900">Login</h2>
      <p className="mt-2 text-sm text-slate-600">
        Access your account to report and track accessibility issues.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-600"
            placeholder="name@example.com"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-600"
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Error message */}
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-sky-700 px-5 py-3 font-semibold text-white transition hover:bg-sky-800 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      {/* Register link */}
      <p className="mt-5 text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          className="font-semibold text-sky-700 hover:underline"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}