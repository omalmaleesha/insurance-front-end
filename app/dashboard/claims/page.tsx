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
  RotateCcw,
} from "lucide-react";

export default function ClaimsPage() {
  const { data: claims = [], isLoading, isError, refetch } = useClaims();
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

  const handleReload = () => {
    if (refetch) {
      refetch();
    } else {
      window.location.reload();
    }
  };

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
      REPORTED: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
      UNDER_REVIEW: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
      APPROVED: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
      REJECTED: "bg-rose-500/10 text-rose-400 border border-rose-500/30",
      CLOSED: "bg-slate-800 text-slate-400 border border-slate-700",
    };
    return map[status] || "bg-slate-800 text-slate-400 border border-slate-700";
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-700/80 bg-[#0f172a] px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  return (
    <div className="space-y-6 rounded-3xl bg-[#070d19] p-6 text-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-100 sm:text-2xl">
            Claim Management
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Register and manage insurance claims from the hotline
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReload}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
            title="Reload claims list"
          >
            <RotateCcw className="h-4 w-4" />
            Reload
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            New Claim
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <SummaryCard title="Total" value={stats.total} />
        <SummaryCard title="Reported" value={stats.reported} accent="amber" />
        <SummaryCard title="Under Review" value={stats.underReview} accent="blue" />
        <SummaryCard title="Approved" value={stats.approved} accent="emerald" />
        <SummaryCard title="Rejected" value={stats.rejected} accent="rose" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-[#0b1329]/90 p-4 shadow-xl backdrop-blur-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by claim number, location, customer ID, branch…"
            className="w-full rounded-xl border border-slate-700/80 bg-[#0f172a] py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-700/80 bg-[#0f172a] px-3.5 py-2.5 text-sm text-slate-300 outline-none transition focus:border-blue-500"
        >
          <option value="ALL">All Status</option>
          {Object.values(ClaimStatus).map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-slate-700/80 bg-[#0f172a] px-3.5 py-2.5 text-sm text-slate-300 outline-none transition focus:border-blue-500"
        >
          <option value="ALL">All Types</option>
          {Object.values(ClaimType).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-[#0b1329]/90 shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800/80 text-sm">
            <thead className="bg-[#0f172a]">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Claim No</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Customer</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Type</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Location</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Incident Date</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                      <span className="text-sm font-medium">Loading claim records…</span>
                    </div>
                  </td>
                </tr>
              )}

              {isError && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20">
                        <AlertTriangle className="h-6 w-6 text-rose-400" />
                      </div>
                      <p className="text-base font-semibold text-slate-200">Failed to load claims</p>
                      <p className="text-xs text-slate-400">A network or server error occurred while retrieving data.</p>
                      <button
                        onClick={handleReload}
                        className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && !isError && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <FileWarning className="mx-auto mb-3 h-8 w-8 text-slate-500" />
                    No claims found matching your filter criteria
                  </td>
                </tr>
              )}

              {!isLoading &&
                !isError &&
                filtered.map((claim) => (
                  <tr key={claim.id} className="transition hover:bg-slate-800/40">
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-100">
                      {claim.claimNumber}
                    </td>
                    <td className="px-5 py-4 text-slate-300">#{claim.customerId}</td>
                    <td className="px-5 py-4 text-slate-300">{claim.claimType}</td>
                    <td className="px-5 py-4 text-slate-400">{claim.incidentLocation}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                      {new Date(claim.incidentDate).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide ${statusBadge(claim.status)}`}>
                        {claim.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/claims/${claim.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/10 hover:border-blue-500/30"
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
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700/60 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10 hover:border-rose-500/30 disabled:cursor-not-allowed disabled:opacity-30"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-800 bg-[#0b1329] text-slate-100 shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-800 bg-[#0b1329] px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Create New Claim</h3>
                <p className="text-xs text-slate-400">Hotline staff – register incident details</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-slate-400">Customer ID *</label>
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
                  <label className="text-xs font-medium text-slate-400">Created By (ETF No) *</label>
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
                  <label className="text-xs font-medium text-slate-400">Claim Type *</label>
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
                  <label className="text-xs font-medium text-slate-400">Branch Code *</label>
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
                  <label className="text-xs font-medium text-slate-400">Incident Date & Time *</label>
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
                  <label className="text-xs font-medium text-slate-400">Incident Location *</label>
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
                <label className="text-xs font-medium text-slate-400">Incident Description *</label>
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
                <label className="text-xs font-medium text-slate-400">Situation Statement</label>
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

              <div className="flex justify-end gap-3 border-t border-slate-800/80 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-700/80 bg-slate-900/60 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createClaim.isPending}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-50"
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
  const accentStyles = {
    slate: "text-slate-100 bg-[#0b1329]/90 border-slate-800/80",
    amber: "text-amber-400 bg-amber-500/5 border-amber-500/20",
    blue: "text-blue-400 bg-blue-500/5 border-blue-500/20",
    emerald: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20",
    rose: "text-rose-400 bg-rose-500/5 border-rose-500/20",
  };

  return (
    <div className={`rounded-2xl border p-5 shadow-lg backdrop-blur-sm ${accentStyles[accent]}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
    </div>
  );
}