"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  useClaims,
  useCreateClaim,
  useDeleteClaim,
} from "./hooks/useClaim";
import {
  ClaimType,
  ClaimStatus,
  ClaimCreateRequest,
} from "../../lib/types/claim";
import {
  Search,
  Plus,
  Eye,
  Trash2,
  Loader2,
  AlertTriangle,
  FileWarning,
  X,
} from "lucide-react";

export default function ClaimsPage() {
  const { data: claims = [], isLoading, isError } = useClaims();
  const createClaim = useCreateClaim();
  const deleteClaim = useDeleteClaim();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const [form, setForm] = useState<ClaimCreateRequest>({
    customerId: 0,
    createdByEtfNo: "",
    claimType: ClaimType.MOTOR,
    incidentDate: "",
    incidentLocation: "",
    incidentDescription: "",
    situationStatement: "",
    branchCode: "",
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return claims.filter((c) => {
      const matchesSearch =
        !q ||
        c.claimNumber.toLowerCase().includes(q) ||
        c.incidentLocation.toLowerCase().includes(q) ||
        String(c.customerId).includes(q) ||
        c.branchCode.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" || c.status === statusFilter;
      const matchesType =
        typeFilter === "ALL" || c.claimType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [claims, search, statusFilter, typeFilter]);

  const stats = useMemo(() => {
    return {
      total: claims.length,
      reported: claims.filter((c) => c.status === ClaimStatus.REPORTED).length,
      underReview: claims.filter((c) => c.status === ClaimStatus.UNDER_REVIEW).length,
      approved: claims.filter((c) => c.status === ClaimStatus.APPROVED).length,
      rejected: claims.filter((c) => c.status === ClaimStatus.REJECTED).length,
    };
  }, [claims]);

  const resetForm = useCallback(() => {
    setForm({
      customerId: 0,
      createdByEtfNo: "",
      claimType: ClaimType.MOTOR,
      incidentDate: "",
      incidentLocation: "",
      incidentDescription: "",
      situationStatement: "",
      branchCode: "",
    });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClaim.mutateAsync({
        ...form,
        incidentDate: form.incidentDate.includes("T")
          ? form.incidentDate
          : `${form.incidentDate}T00:00:00`,
      });
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to create claim");
    }
  };

  const handleDelete = async (id: number, status: string) => {
    if (status !== ClaimStatus.REPORTED) {
      alert("Only claims with status REPORTED can be deleted.");
      return;
    }
    if (!window.confirm("Delete this claim?")) return;
    try {
      setActionLoadingId(id);
      await deleteClaim.mutateAsync(id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete claim");
    } finally {
      setActionLoadingId(null);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      REPORTED: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
      UNDER_REVIEW: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
      APPROVED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
      REJECTED: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
      CLOSED: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    };
    return map[status] || "bg-slate-100 text-slate-600 ring-1 ring-slate-200";
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Claim Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Register and manage insurance claims from the hotline
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          New Claim
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <SummaryCard title="Total" value={stats.total} />
        <SummaryCard title="Reported" value={stats.reported} accent="amber" />
        <SummaryCard title="Under Review" value={stats.underReview} accent="blue" />
        <SummaryCard title="Approved" value={stats.approved} accent="emerald" />
        <SummaryCard title="Rejected" value={stats.rejected} accent="rose" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by claim number, location, customer ID, branch…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        >
          <option value="ALL">All Status</option>
          {Object.values(ClaimStatus).map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        >
          <option value="ALL">All Types</option>
          {Object.values(ClaimType).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase text-slate-500">Claim No</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase text-slate-500">Customer</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase text-slate-500">Type</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase text-slate-500">Location</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase text-slate-500">Incident Date</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase text-slate-500">Status</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Loader2 className="h-7 w-7 animate-spin" />
                      <span>Loading claims…</span>
                    </div>
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-rose-500">
                      <AlertTriangle className="h-7 w-7" />
                      <span>Failed to load claims</span>
                    </div>
                  </td>
                </tr>
              )}
              {!isLoading && !isError && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <FileWarning className="mx-auto mb-3 h-8 w-8 opacity-50" />
                    No claims found
                  </td>
                </tr>
              )}
              {!isLoading &&
                filtered.map((claim) => (
                  <tr key={claim.id} className="transition hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-5 py-3.5 font-semibold text-slate-900">
                      {claim.claimNumber}
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">#{claim.customerId}</td>
                    <td className="px-5 py-3.5 text-slate-700">{claim.claimType}</td>
                    <td className="px-5 py-3.5 text-slate-600">{claim.incidentLocation}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-slate-600">
                      {new Date(claim.incidentDate).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusBadge(claim.status)}`}>
                        {claim.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/dashboard/claims/${claim.id}`}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(claim.id, claim.status)}
                          disabled={
                            claim.status !== ClaimStatus.REPORTED ||
                            actionLoadingId === claim.id
                          }
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Create New Claim</h3>
                <p className="text-sm text-slate-500">Hotline staff – register incident details</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Customer ID *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.customerId || ""}
                    onChange={(e) =>
                      setForm({ ...form, customerId: Number(e.target.value) })
                    }
                    className={inputClass}
                    placeholder="e.g. 1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Created By (ETF No) *</label>
                  <input
                    type="text"
                    required
                    value={form.createdByEtfNo}
                    onChange={(e) =>
                      setForm({ ...form, createdByEtfNo: e.target.value })
                    }
                    className={inputClass}
                    placeholder="ETF001"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Claim Type *</label>
                  <select
                    value={form.claimType}
                    onChange={(e) =>
                      setForm({ ...form, claimType: e.target.value as ClaimType })
                    }
                    className={inputClass}
                  >
                    {Object.values(ClaimType).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Branch Code *</label>
                  <input
                    type="text"
                    required
                    value={form.branchCode}
                    onChange={(e) =>
                      setForm({ ...form, branchCode: e.target.value })
                    }
                    className={inputClass}
                    placeholder="COL001"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Incident Date & Time *</label>
                  <input
                    type="datetime-local"
                    required
                    value={form.incidentDate}
                    onChange={(e) =>
                      setForm({ ...form, incidentDate: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600">Incident Location *</label>
                  <input
                    type="text"
                    required
                    value={form.incidentLocation}
                    onChange={(e) =>
                      setForm({ ...form, incidentLocation: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Colombo"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Incident Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.incidentDescription}
                  onChange={(e) =>
                    setForm({ ...form, incidentDescription: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Describe what happened…"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600">Situation Statement</label>
                <textarea
                  rows={2}
                  value={form.situationStatement || ""}
                  onChange={(e) =>
                    setForm({ ...form, situationStatement: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Customer statement (optional)"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createClaim.isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                >
                  {createClaim.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {createClaim.isPending ? "Creating…" : "Create Claim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  title,
  value,
  accent = "slate",
}: {
  title: string;
  value: number;
  accent?: "slate" | "amber" | "blue" | "emerald" | "rose";
}) {
  const colors = {
    slate: "text-slate-900",
    amber: "text-amber-600",
    blue: "text-blue-600",
    emerald: "text-emerald-600",
    rose: "text-rose-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
      <p className={`mt-2 text-3xl font-bold tracking-tight ${colors[accent]}`}>{value}</p>
    </div>
  );
}