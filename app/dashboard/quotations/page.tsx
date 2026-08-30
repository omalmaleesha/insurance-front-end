"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// lightweight fallback for react-hot-toast
const toast = {
  success: (msg: string) => {
    if (typeof window !== "undefined") console.log("SUCCESS:", msg);
  },
  error: (msg: string) => {
    if (typeof window !== "undefined") console.error("ERROR:", msg);
  },
};

import {
  useQuotations,
  useCreateQuotation,
  useCalculateQuotation,
  useApproveQuotation,
  useRejectQuotation,
  useDeleteQuotation,
  useDuplicateQuotation,
  useDownloadQuotationPdf,
  useQuotation,
} from "../quotations/hooks/useQuotation";

import {
  CreateQuotationRequest,
  Quotation,
  QuotationStatus,
  QuotationType,
  CurrencyType,
} from "../../lib/types/quatation";

export default function QuotationComponent() {
  const { data, isLoading } = useQuotations();

  const createQuotation = useCreateQuotation();
  const calculateQuotation = useCalculateQuotation();
  const approveQuotation = useApproveQuotation();
  const rejectQuotation = useRejectQuotation();
  const deleteQuotation = useDeleteQuotation();
  const duplicateQuotation = useDuplicateQuotation();
  const downloadPdf = useDownloadQuotationPdf();

  const quotations = data ?? [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const [selectedQuotationId, setSelectedQuotationId] = useState<number | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const { data: quotationDetails } = useQuotation(selectedQuotationId ?? 0);

  // Form State
  const [form, setForm] = useState<CreateQuotationRequest>({
    customerName: "",
    currency: "LKR",
    quotationType: "PRIVATE_HOUSE",
    residentialRisk: {
      propertyName: "",
      locationAddress: "",
      buildingSumInsured: 0,
      contentsSumInsured: 0,
      hasFireAlarm: false,
      hasAutomaticSprinklers: false,
      distanceToNearestFireStationKm: 0,
      constructionMaterialClass: "",
      numberOfFloors: 1,
      yearBuilt: new Date().getFullYear(),
      occupancyType: "",
      isSecuredGatedProperty: false,
    },
    commercialRisk: {
      propertyName: "",
      locationAddress: "",
      buildingSumInsured: 0,
      contentsSumInsured: 0,
      hasFireAlarm: false,
      hasAutomaticSprinklers: false,
      distanceToNearestFireStationKm: 0,
      businessActivity: "",
      footTrafficLevel: "",
      hasServerRoom: false,
      hasKitchenOrCookingFacility: false,
      hasHoseReels: false,
    },
    industrialRisk: {
      propertyName: "",
      locationAddress: "",
      buildingSumInsured: 0,
      contentsSumInsured: 0,
      hasFireAlarm: false,
      hasAutomaticSprinklers: false,
      distanceToNearestFireStationKm: 0,
      manufacturingType: "",
      machinerySumInsured: 0,
      hasFlammableMaterials: false,
      flammableMaterialCategory: "",
      hasBoilersOrHeavyMachinery: false,
      hasOnsiteHydrants: false,
      hasFireDoorsAndWalls: false,
    },
  });

  // Summary Metrics
  const total = quotations.length;
  const draft = quotations.filter((q) => q.status === "DRAFT").length;
  const approved = quotations.filter((q) => q.status === "APPROVED").length;
  const issued = quotations.filter((q) => q.status === "ISSUED").length;
  const rejected = quotations.filter((q) => q.status === "REJECTED").length;

  const filtered = useMemo(() => {
    return quotations.filter((q) => {
      const matchesSearch =
        q.customerName.toLowerCase().includes(search.toLowerCase()) ||
        q.quotationReference.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || q.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [quotations, search, statusFilter]);

  const getStatusBadge = (status: QuotationStatus) => {
    switch (status) {
      case "DRAFT":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
      case "ISSUED":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
      default:
        return "bg-slate-50 text-slate-700 ring-1 ring-slate-200";
    }
  };

  // Handlers
  const handleView = (quotation: Quotation) => {
    setSelectedQuotationId(quotation.id);
    setSelectedQuotation(quotation);
    setShowViewModal(true);
  };

  const handleCalculate = async (id: number) => {
    try {
      setActionLoadingId(id);
      await calculateQuotation.mutateAsync(id);
      toast.success("Premium calculated");
    } catch {
      toast.error("Calculation failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm("Approve this quotation?")) return;
    try {
      setActionLoadingId(id);
      await approveQuotation.mutateAsync(id);
      toast.success("Quotation approved");
    } catch {
      toast.error("Unable to approve quotation");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!selectedQuotation) return;
    try {
      setActionLoadingId(selectedQuotation.id);
      await rejectQuotation.mutateAsync({
        id: selectedQuotation.id,
        reason: rejectReason,
      });
      toast.success("Quotation rejected");
      setShowRejectModal(false);
    } catch {
      toast.error("Unable to reject quotation");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDuplicate = async (id: number) => {
    try {
      setActionLoadingId(id);
      await duplicateQuotation.mutateAsync(id);
      toast.success("Quotation duplicated");
    } catch {
      toast.error("Duplicate failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this quotation?")) return;
    try {
      setActionLoadingId(id);
      await deleteQuotation.mutateAsync(id);
      toast.success("Quotation deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handlePdf = async (id: number) => {
    try {
      setActionLoadingId(id);
      const blob = await downloadPdf.mutateAsync(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quotation-${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("PDF downloaded");
    } catch {
      toast.error("Unable to download PDF");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCreateQuotation = async () => {
    try {
      await createQuotation.mutateAsync(form);
      toast.success("Quotation created");
      setShowCreateModal(false);
    } catch {
      toast.error("Unable to create quotation");
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

  return (
    <div className="space-y-6">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Quotation Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Create, calculate, approve and manage customer quotations
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Quotation
        </button>
      </div>

      {/* ─── Summary Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <SummaryCard title="Total" value={total} accent="emerald" />
        <SummaryCard title="Draft" value={draft} accent="amber" />
        <SummaryCard title="Approved" value={approved} accent="emerald" />
        <SummaryCard title="Issued" value={issued} accent="blue" />
        <SummaryCard title="Rejected" value={rejected} accent="rose" />
      </div>

      {/* ─── Toolbar ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            placeholder="Search by reference or customer name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        >
          <option value="ALL">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="APPROVED">Approved</option>
          <option value="ISSUED">Issued</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* ─── Table ──────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Ref
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Customer
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Type
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Premium
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-emerald-600 border-t-transparent" />
                      <p className="text-sm text-slate-500">Loading quotations…</p>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                        <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m-6 4h6m-6 4h4M7 3h10a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                        </svg>
                      </div>
                      <h3 className="text-base font-semibold text-slate-800">No quotations found</h3>
                      <p className="mt-1.5 text-sm text-slate-500">
                        {search || statusFilter !== "ALL"
                          ? "Try adjusting your filters."
                          : "Create your first quotation to get started."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {!isLoading &&
                filtered.map((quotation) => (
                  <tr key={quotation.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                      {quotation.quotationReference}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-800">
                      {quotation.customerName}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {quotation.quotationType.replace(/_/g, " ")}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                      {quotation.grandTotalPremium}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusBadge(
                          quotation.status
                        )}`}
                      >
                        {quotation.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <Link
                          href={`/dashboard/quotations/${quotation.id}`}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          View
                        </Link>
                        <ActionBtn
                          onClick={() => handleCalculate(quotation.id)}
                          disabled={actionLoadingId === quotation.id}
                          variant="blue"
                        >
                          {actionLoadingId === quotation.id ? "…" : "Calc"}
                        </ActionBtn>
                        <ActionBtn
                          onClick={() => handleApprove(quotation.id)}
                          disabled={
                            quotation.status === "APPROVED" ||
                            actionLoadingId === quotation.id
                          }
                          variant="emerald"
                        >
                          Approve
                        </ActionBtn>
                        <ActionBtn
                          onClick={() => handleReject(quotation)}
                          disabled={
                            quotation.status === "REJECTED" ||
                            actionLoadingId === quotation.id
                          }
                          variant="rose"
                        >
                          Reject
                        </ActionBtn>
                        <ActionBtn
                          onClick={() => handleDuplicate(quotation.id)}
                          disabled={actionLoadingId === quotation.id}
                          variant="orange"
                        >
                          Dup
                        </ActionBtn>
                        <ActionBtn
                          onClick={() => handlePdf(quotation.id)}
                          disabled={actionLoadingId === quotation.id}
                          variant="purple"
                        >
                          PDF
                        </ActionBtn>
                        <ActionBtn
                          onClick={() => handleDelete(quotation.id)}
                          disabled={actionLoadingId === quotation.id}
                          variant="dark"
                        >
                          Del
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Create Modal ───────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Create Quotation</h2>
                <p className="text-sm text-slate-500">Fill in the risk details below</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Customer Name
                  </label>
                  <input
                    placeholder="Customer full name"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Currency
                  </label>
                  <select
                    value={form.currency}
                    onChange={(e) =>
                      setForm({ ...form, currency: e.target.value as CurrencyType })
                    }
                    className={inputClass}
                  >
                    <option value="LKR">LKR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Quotation Type
                </label>
                <select
                  value={form.quotationType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      quotationType: e.target.value as QuotationType,
                    })
                  }
                  className={inputClass}
                >
                  <option value="PRIVATE_HOUSE">Private House</option>
                  <option value="BUSINESS_PREMISES">Business Premises</option>
                  <option value="INDUSTRIAL_PREMISES">Industrial Premises</option>
                </select>
              </div>

              {/* Dynamic Risk Sections */}
              {form.quotationType === "PRIVATE_HOUSE" && (
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-slate-800">
                    Residential Risk Details
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      placeholder="Property Name"
                      value={form.residentialRisk.propertyName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          residentialRisk: {
                            ...form.residentialRisk,
                            propertyName: e.target.value,
                          },
                        })
                      }
                      className={inputClass}
                    />
                    <input
                      placeholder="Location Address"
                      value={form.residentialRisk.locationAddress}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          residentialRisk: {
                            ...form.residentialRisk,
                            locationAddress: e.target.value,
                          },
                        })
                      }
                      className={inputClass}
                    />
                    <input
                      type="number"
                      placeholder="Building Sum Insured"
                      value={form.residentialRisk.buildingSumInsured || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          residentialRisk: {
                            ...form.residentialRisk,
                            buildingSumInsured: Number(e.target.value),
                          },
                        })
                      }
                      className={inputClass}
                    />
                    <input
                      type="number"
                      placeholder="Contents Sum Insured"
                      value={form.residentialRisk.contentsSumInsured || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          residentialRisk: {
                            ...form.residentialRisk,
                            contentsSumInsured: Number(e.target.value),
                          },
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              )}

              {form.quotationType === "BUSINESS_PREMISES" && (
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-slate-800">
                    Commercial Risk Details
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      placeholder="Business Activity"
                      value={form.commercialRisk.businessActivity}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          commercialRisk: {
                            ...form.commercialRisk,
                            businessActivity: e.target.value,
                          },
                        })
                      }
                      className={inputClass}
                    />
                    <input
                      placeholder="Property Name"
                      value={form.commercialRisk.propertyName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          commercialRisk: {
                            ...form.commercialRisk,
                            propertyName: e.target.value,
                          },
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              )}

              {form.quotationType === "INDUSTRIAL_PREMISES" && (
                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-slate-800">
                    Industrial Risk Details
                  </h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <input
                      placeholder="Manufacturing Type"
                      value={form.industrialRisk.manufacturingType}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          industrialRisk: {
                            ...form.industrialRisk,
                            manufacturingType: e.target.value,
                          },
                        })
                      }
                      className={inputClass}
                    />
                    <input
                      type="number"
                      placeholder="Machinery Sum Insured"
                      value={form.industrialRisk.machinerySumInsured || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          industrialRisk: {
                            ...form.industrialRisk,
                            machinerySumInsured: Number(e.target.value),
                          },
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuotation}
                disabled={createQuotation.isPending}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 disabled:opacity-60"
              >
                {createQuotation.isPending ? "Creating…" : "Create Quotation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Reject Modal ───────────────────────────────────────────── */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50">
              <svg className="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900">Reject Quotation</h3>
            <p className="mt-1 text-sm text-slate-500">
              Please provide a reason for rejecting this quotation.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection…"
              className="mt-4 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── View Modal ─────────────────────────────────────────────── */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">Quotation Details</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 p-6 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">Reference</p>
                  <p className="mt-0.5 font-semibold text-slate-900">
                    {selectedQuotation?.quotationReference}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Status</p>
                  <p className="mt-0.5 font-semibold text-slate-900">
                    {selectedQuotation?.status}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Customer</p>
                  <p className="mt-0.5 font-semibold text-slate-900">
                    {selectedQuotation?.customerName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Type</p>
                  <p className="mt-0.5 font-semibold text-slate-900">
                    {selectedQuotation?.quotationType?.replace(/_/g, " ")}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-slate-500">
                    Grand Total Premium
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-emerald-600">
                    {selectedQuotation?.grandTotalPremium}
                  </p>
                </div>
              </div>

              {quotationDetails && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Full Details
                  </p>
                  <pre className="max-h-64 overflow-auto whitespace-pre-wrap text-xs text-slate-700">
                    {JSON.stringify(quotationDetails, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-slate-100 px-6 py-4">
              <button
                onClick={() => setShowViewModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sub Components ───────────────────────────────────────────────── */

function SummaryCard({
  title,
  value,
  accent,
}: {
  title: string;
  value: number;
  accent: "emerald" | "amber" | "blue" | "rose";
}) {
  const styles = {
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    blue: "text-blue-600 bg-blue-50",
    rose: "text-rose-600 bg-rose-50",
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <p className={`mt-2 text-3xl font-bold tracking-tight ${styles[accent].split(" ")[0]}`}>
        {value}
      </p>
    </div>
  );
}

function ActionBtn({
  children,
  onClick,
  disabled,
  variant = "ghost",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "ghost" | "blue" | "emerald" | "rose" | "orange" | "purple" | "dark";
}) {
  const variants = {
    ghost: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    blue: "bg-blue-600 text-white hover:bg-blue-700",
    emerald: "bg-emerald-600 text-white hover:bg-emerald-700",
    rose: "bg-rose-600 text-white hover:bg-rose-700",
    orange: "bg-orange-500 text-white hover:bg-orange-600",
    purple: "bg-purple-600 text-white hover:bg-purple-700",
    dark: "bg-slate-800 text-white hover:bg-slate-900",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]}`}
    >
      {children}
    </button>
  );
}