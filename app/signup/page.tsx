"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface UserDTO {
  etfNo: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  nic: string;
  gender: "MALE" | "FEMALE";
  dateOfBirth: string;
  address: string;
  designation: string;
  employeeType: "PERMANENT" | "CONTRACT";
  specialization: string;
  underwritingLimit: number;
  approvalLevel: number;
  branchCode: string;
  department: string;
  status: "ACTIVE" | "INACTIVE";
  joinedDate: string;
  role: "ADMIN" | "USER" | "UNDERWRITER";
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<UserDTO>({
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        throw new Error("Registration failed. Please check your inputs.");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15";

  const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-800">
      {/* Background mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Create User Account
              </h1>
              <p className="text-sm text-slate-500">
                Register a new employee in the SecureCover system
              </p>
            </div>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Sign in
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3.5 text-sm text-rose-700">
            <svg
              className="mt-0.5 h-5 w-5 shrink-0 text-rose-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ─── Section 1: Personal Details ─────────────────────────── */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 text-sm font-bold">
                  1
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Personal Details
                  </h2>
                  <p className="text-xs text-slate-500">
                    Basic identity and contact information
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={labelClass}>ETF No *</label>
                  <input
                    type="text"
                    name="etfNo"
                    required
                    placeholder="ETF-10293"
                    value={formData.etfNo}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>NIC / National ID *</label>
                  <input
                    type="text"
                    name="nic"
                    required
                    placeholder="199812345678"
                    value={formData.nic}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    placeholder="+94 77 123 4567"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className={labelClass}>Residential Address *</label>
                  <input
                    type="text"
                    name="address"
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
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 text-sm font-bold">
                  2
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Employment & Operations
                  </h2>
                  <p className="text-xs text-slate-500">
                    Role, department, and authority levels
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={labelClass}>Designation *</label>
                  <input
                    type="text"
                    name="designation"
                    required
                    placeholder="Senior Underwriter"
                    value={formData.designation}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Department *</label>
                  <input
                    type="text"
                    name="department"
                    required
                    placeholder="Marine Insurance"
                    value={formData.department}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Branch Code *</label>
                  <input
                    type="text"
                    name="branchCode"
                    required
                    placeholder="BR-001"
                    value={formData.branchCode}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Employee Type *</label>
                  <select
                    name="employeeType"
                    value={formData.employeeType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="PERMANENT">Permanent</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Specialization *</label>
                  <input
                    type="text"
                    name="specialization"
                    required
                    placeholder="Aviation Claims / Health"
                    value={formData.specialization}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Joined Date *</label>
                  <input
                    type="date"
                    name="joinedDate"
                    required
                    value={formData.joinedDate}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Underwriting Limit ($)*</label>
                  <input
                    type="number"
                    name="underwritingLimit"
                    required
                    min="0"
                    value={formData.underwritingLimit}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Approval Level *</label>
                  <input
                    type="number"
                    name="approvalLevel"
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
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
            <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 text-sm font-bold">
                  3
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Account & Credentials
                  </h2>
                  <p className="text-xs text-slate-500">
                    Login details and system access
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john.doe@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${inputClass} pr-11`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>System Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="USER">User</option>
                    <option value="UNDERWRITER">Underwriter</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Initial Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Sign in here
              </Link>
            </p>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-emerald-600/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Register User
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}