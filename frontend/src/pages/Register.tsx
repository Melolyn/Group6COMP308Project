import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import type { UserRole } from "../types/user";
            export default function Register() {
            const navigate = useNavigate();
                
            const [form, setForm] = useState({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                role: "resident" as UserRole,
                });
             async function handleSubmit(e: FormEvent) {
                e.preventDefault();
                await authService.register(form);
                navigate("/login");
                }
            return (
                <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bgwhite p-8 shadow-sm">
                <h2 className="text-3xl font-bold text-slate-900">Create an account</h2>
                <p className="mt-2 text-sm text-slate-600">
                Register as a resident, staff member, or community advocate.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
                <div>
                <label className="mb-2 block text-sm font-medium textslate-700">First name</label>
                <input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3
                focus:border-sky-600 focus:outline-none"
                required
                />
                </div>
                <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Last
                name</label>
                <input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3
                focus:border-sky-600 focus:outline-none"
                required
                />
                </div>
                <div className="md:col-span-2">
                14
                <label className="mb-2 block text-sm font-medium textslate-700">Email</label>
                <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3
                focus:border-sky-600 focus:outline-none"
                required
                />
                </div>
                <div>
                <label className="mb-2 block text-sm font-medium textslate-700">Password</label>
                <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3
                focus:border-sky-600 focus:outline-none"
                required
                />
                </div>
                <div>
                <label className="mb-2 block text-sm font-medium textslate-700">Role</label>
                <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as
                UserRole })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3
                focus:border-sky-600 focus:outline-none"
                >
                <option value="resident">Resident</option>
                <option value="staff">Municipal Staff</option>
                <option value="advocate">Community Advocate</option>
                </select>
                </div>
                <div className="md:col-span-2">
                <button
                type="submit"
                className="w-full rounded-xl bg-sky-700 px-5 py-3 font-semibold
                text-white transition hover:bg-sky-800"
                >
                Register
                15
                </button>
                </div>
                </form>
                <p className="mt-5 text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-sky-700
                hover:underline">
                Login
                </Link>
                </p>
                </div>
                );
                }
