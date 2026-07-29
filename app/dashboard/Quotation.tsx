"use client";

import { useMemo, useState } from "react";
// lightweight fallback for react-hot-toast when the module or types are unavailable
// Keeps API surface minimal: toast.success and toast.error
const toast = {
  success: (msg: string) => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.log("SUCCESS:", msg);
    }
  },
  error: (msg: string) => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.error("ERROR:", msg);
    }
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
} from "../hooks/useQuotation";

import {
  CreateQuotationRequest,
  Quotation,
  QuotationStatus,
  QuotationType,
  CurrencyType,
} from "../lib/types/quatation";

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
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "APPROVED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "ISSUED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Quotation Management
          </h2>
          <p className="text-sm text-slate-500">
            Create, calculate, and manage customer quotations.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-95"
        >
          + New Quotation
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <SummaryCard title="Total" value={total} color="emerald" />
        <SummaryCard title="Draft" value={draft} color="amber" />
        <SummaryCard title="Approved" value={approved} color="green" />
        <SummaryCard title="Issued" value={issued} color="blue" />
        <SummaryCard title="Rejected" value={rejected} color="red" />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <input
          placeholder="Search by reference or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 outline-none transition focus:border-emerald-500"
        >
          <option value="ALL">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="APPROVED">Approved</option>
          <option value="ISSUED">Issued</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Quotations Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-4">Ref</th>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Premium</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-500">
                    Loading quotations...
                  </td>
                </tr>
              )}

              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-500">
                    No quotations found
                  </td>
                </tr>
              )}

              {!isLoading &&
                filtered.map((quotation) => (
                  <tr
                    key={quotation.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                      {quotation.quotationReference}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {quotation.customerName}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      {quotation.quotationType}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                      {quotation.grandTotalPremium}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadge(
                          quotation.status
                        )}`}
                      >
                        {quotation.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleView(quotation)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          View
                        </button>

                        <button
                          disabled={actionLoadingId === quotation.id}
                          onClick={() => handleCalculate(quotation.id)}
                          className="rounded-lg bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          {actionLoadingId === quotation.id ? "..." : "Calculate"}
                        </button>

                        <button
                          disabled={
                            quotation.status === "APPROVED" ||
                            actionLoadingId === quotation.id
                          }
                          onClick={() => handleApprove(quotation.id)}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          disabled={
                            quotation.status === "REJECTED" ||
                            actionLoadingId === quotation.id
                          }
                          onClick={() => handleReject(quotation)}
                          className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>

                        <button
                          disabled={actionLoadingId === quotation.id}
                          onClick={() => handleDuplicate(quotation.id)}
                          className="rounded-lg bg-orange-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                        >
                          Duplicate
                        </button>

                        <button
                          disabled={actionLoadingId === quotation.id}
                          onClick={() => handlePdf(quotation.id)}
                          className="rounded-lg bg-purple-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-50"
                        >
                          PDF
                        </button>

                        <button
                          disabled={actionLoadingId === quotation.id}
                          onClick={() => handleDelete(quotation.id)}
                          className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-black disabled:opacity-50"
                        >
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-bold text-slate-800">
                Create Quotation
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-2xl font-semibold text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Customer Name
                  </label>
                  <input
                    placeholder="Customer Name"
                    value={form.customerName}
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">
                    Currency
                  </label>
                  <select
                    value={form.currency}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        currency: e.target.value as CurrencyType,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-sm"
                  >
                    <option value="LKR">LKR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-600">
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
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm"
                >
                  <option value="PRIVATE_HOUSE">Private House</option>
                  <option value="BUSINESS_PREMISES">Business Premises</option>
                  <option value="INDUSTRIAL_PREMISES">
                    Industrial Premises
                  </option>
                </select>
              </div>

              {/* Dynamic Risk Inputs */}
              {form.quotationType === "PRIVATE_HOUSE" && (
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
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
                    className="rounded-lg border border-slate-200 p-2.5 text-sm"
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
                    className="rounded-lg border border-slate-200 p-2.5 text-sm"
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
                    className="rounded-lg border border-slate-200 p-2.5 text-sm"
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
                    className="rounded-lg border border-slate-200 p-2.5 text-sm"
                  />
                </div>
              )}

              {form.quotationType === "BUSINESS_PREMISES" && (
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
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
                    className="rounded-lg border border-slate-200 p-2.5 text-sm"
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
                    className="rounded-lg border border-slate-200 p-2.5 text-sm"
                  />
                </div>
              )}

              {form.quotationType === "INDUSTRIAL_PREMISES" && (
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
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
                    className="rounded-lg border border-slate-200 p-2.5 text-sm"
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
                    className="rounded-lg border border-slate-200 p-2.5 text-sm"
                  />
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t pt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateQuotation}
                disabled={createQuotation.isPending}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {createQuotation.isPending ? "Creating..." : "Create Quotation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-800">
              Reject Quotation
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Please enter the reason for rejecting this quotation.
            </p>

            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="mt-4 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-red-500"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-lg font-bold text-slate-800">
                Quotation Details
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-2xl text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>
                <strong>Ref:</strong> {selectedQuotation?.quotationReference}
              </p>
              <p>
                <strong>Customer Name:</strong> {selectedQuotation?.customerName}
              </p>
              <p>
                <strong>Type:</strong> {selectedQuotation?.quotationType}
              </p>
              <p>
                <strong>Status:</strong> {selectedQuotation?.status}
              </p>
              <p>
                <strong>Grand Total Premium:</strong>{" "}
                {selectedQuotation?.grandTotalPremium}
              </p>
              {quotationDetails && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <pre className="whitespace-pre-wrap text-xs text-slate-700">
                    {JSON.stringify(quotationDetails, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
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

// Summary Card Sub-component
function SummaryCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "emerald" | "amber" | "green" | "blue" | "red";
}) {
  const textColorMap = {
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    green: "text-green-600",
    blue: "text-blue-600",
    red: "text-red-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {title}
      </p>
      <h2 className={`mt-2 text-3xl font-bold ${textColorMap[color]}`}>
        {value}
      </h2>
    </div>
  );
}