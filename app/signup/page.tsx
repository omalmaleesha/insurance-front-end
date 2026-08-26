"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreateUserDTO } from "../lib/types/user";
import {
  UserPlus,
  ArrowLeft,
  AlertTriangle,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<CreateUserDTO>({
    etfNo: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    nic: "",
    gender: "MALE",
    dateOfBirth: "",
    address: "",
    designation: "",
    employeeType: "PERMANENT",
    specialization: "",
    underwritingLimit: 0,
    approvalLevel: 1,
    branchCode: "",
    department: "",
    status: "ACTIVE",
    joinedDate: new Date().toISOString().split("T")[0],
    role: "USER",
  });

  // Clear error as soon as user starts typing
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));

      if (error) setError(null);
    },
    [error]
  );

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || "Registration failed. Please check your inputs.");
        }

        router.push("/login");
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    [formData, router]
  );

  // Disable button when loading or required fields are empty
  const isSubmitDisabled = useMemo(() => {
    return (
      loading ||
      !formData.etfNo.trim() ||
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.phoneNumber.trim() ||
      !formData.nic.trim() ||
      !formData.dateOfBirth ||
      !formData.address.trim() ||
      !formData.designation.trim() ||
      !formData.department.trim() ||
      !formData.branchCode.trim() ||
      !formData.specialization.trim()
    );
  }, [loading, formData]);

  const inputClass =
    "w-full rounded-xl border border-slate-800 bg-[#070d19] px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50";

  const labelClass = "mb-1.5 block text-sm font-medium text-slate-300";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070d19] text-slate-100">
      {/* Background Glow Overlay */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/40">
              <UserPlus className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-100">
                Create User Account
              </h1>
              <p className="text-sm text-slate-400">
                Register a new employee in the SecureCover system
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0b1329] px-4 py-2.5 text-sm font-medium text-slate-300 shadow-sm transition hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070d19]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Sign in
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3.5 text-sm text-rose-400"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* ─── Section 1: Personal Details ─────────────────────────── */}
          <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1329] shadow-xl shadow-black/20">
            <div className="border-b border-slate-800/80 bg-slate-900/40 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-sm font-bold text-emerald-400">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">Personal Details</h2>
                  <p className="text-xs text-slate-400">Basic identity and contact information</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="etfNo" className={labelClass}>
                    ETF No *
                  </label>
                  <input
                    id="etfNo"
                    name="etfNo"
                    type="text"
                    required
                    placeholder="ETF-10293"
                    value={formData.etfNo}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="firstName" className={labelClass}>
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className={labelClass}>
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="nic" className={labelClass}>
                    NIC / National ID *
                  </label>
                  <input
                    id="nic"
                    name="nic"
                    type="text"
                    required
                    placeholder="199812345678"
                    value={formData.nic}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className={labelClass}>
                    Phone Number *
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    placeholder="+94 77 123 4567"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="gender" className={labelClass}>
                    Gender *
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="MALE" className="bg-[#0b1329] text-slate-100">Male</option>
                    <option value="FEMALE" className="bg-[#0b1329] text-slate-100">Female</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className={labelClass}>
                    Date of Birth *
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="address" className={labelClass}>
                    Residential Address *
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    placeholder="123 Main St, Colombo"
                    value={formData.address}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ─── Section 2: Employment & Operations ──────────────────── */}
          <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1329] shadow-xl shadow-black/20">
            <div className="border-b border-slate-800/80 bg-slate-900/40 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-sm font-bold text-emerald-400">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">Employment & Operations</h2>
                  <p className="text-xs text-slate-400">Role, department, and authority levels</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="designation" className={labelClass}>
                    Designation *
                  </label>
                  <input
                    id="designation"
                    name="designation"
                    type="text"
                    required
                    placeholder="Senior Underwriter"
                    value={formData.designation}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="department" className={labelClass}>
                    Department *
                  </label>
                  <input
                    id="department"
                    name="department"
                    type="text"
                    required
                    placeholder="Marine Insurance"
                    value={formData.department}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="branchCode" className={labelClass}>
                    Branch Code *
                  </label>
                  <input
                    id="branchCode"
                    name="branchCode"
                    type="text"
                    required
                    placeholder="BR-001"
                    value={formData.branchCode}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="employeeType" className={labelClass}>
                    Employee Type *
                  </label>
                  <select
                    id="employeeType"
                    name="employeeType"
                    value={formData.employeeType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="PERMANENT" className="bg-[#0b1329] text-slate-100">Permanent</option>
                    <option value="CONTRACT" className="bg-[#0b1329] text-slate-100">Contract</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="specialization" className={labelClass}>
                    Specialization *
                  </label>
                  <input
                    id="specialization"
                    name="specialization"
                    type="text"
                    required
                    placeholder="Aviation Claims / Health"
                    value={formData.specialization}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="joinedDate" className={labelClass}>
                    Joined Date *
                  </label>
                  <input
                    id="joinedDate"
                    name="joinedDate"
                    type="date"
                    required
                    value={formData.joinedDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="underwritingLimit" className={labelClass}>
                    Underwriting Limit ($)*
                  </label>
                  <input
                    id="underwritingLimit"
                    name="underwritingLimit"
                    type="number"
                    required
                    min="0"
                    value={formData.underwritingLimit}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="approvalLevel" className={labelClass}>
                    Approval Level *
                  </label>
                  <input
                    id="approvalLevel"
                    name="approvalLevel"
                    type="number"
                    required
                    min="1"
                    max="5"
                    value={formData.approvalLevel}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ─── Section 3: Account & Credentials ────────────────────── */}
          <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1329] shadow-xl shadow-black/20">
            <div className="border-b border-slate-800/80 bg-slate-900/40 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-sm font-bold text-emerald-400">
                  3
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-100">Account & Credentials</h2>
                  <p className="text-xs text-slate-400">Login details and system access</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="john.doe@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${inputClass} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={toggleShowPassword}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[#070d19] rounded-r-xl"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className={labelClass}>
                    System Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="USER" className="bg-[#0b1329] text-slate-100">User</option>
                    <option value="UNDERWRITER" className="bg-[#0b1329] text-slate-100">Underwriter</option>
                    <option value="ADMIN" className="bg-[#0b1329] text-slate-100">Admin</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className={labelClass}>
                    Initial Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="ACTIVE" className="bg-[#0b1329] text-slate-100">Active</option>
                    <option value="INACTIVE" className="bg-[#0b1329] text-slate-100">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="rounded font-semibold text-emerald-400 transition-colors hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070d19]"
              >
                Sign in here
              </Link>
            </p>

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-600/30 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070d19] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Creating Account...
                </>
              ) : (
                <>
                  Register User
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}