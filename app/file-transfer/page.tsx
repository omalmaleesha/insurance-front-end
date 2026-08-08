"use client";

import { useMemo, useState } from "react";
import { useCreateShipment } from "./hooks/useCreateShipment";
import { useShipmentItems } from "../file-transfer/hooks/useShipmentItems";
import { useAddShipmentItem } from "../file-transfer/hooks/useAddShipmentItem";
import { useAllShipments } from "../file-transfer/hooks/useAllShipments";
import { useIncomingShipments } from "../file-transfer/hooks/useIncomingShipments";

import type {
  CreateShipmentRequest,
  ShipmentItemRequest,
} from "../lib/types/shipment";
import { ConfirmShipmentModal } from "./components/ConfirmShipmentModal";

type ViewMode = "CREATE" | "ADD_ITEMS" | "VIEW_ALL" | "INCOMING";

export default function FileTransferTracking() {
  const [activeTab, setActiveTab] = useState<ViewMode>("CREATE");

  // Hooks
  const createShipmentMutation = useCreateShipment();
  const addShipmentItemMutation = useAddShipmentItem();
  const {
    data: allShipments = [],
    isLoading: isLoadingAll,
    refetch: refetchAllShipments,
  } = useAllShipments();

  const {
    data: incomingShipments = [],
    isLoading: isLoadingIncoming,
    refetch: refetchIncoming,
  } = useIncomingShipments();

  // Local state
  const [activeShipmentId, setActiveShipmentId] = useState("");
  const [searchShipmentId, setSearchShipmentId] = useState("");
  const [selectedShipmentForConfirm, setSelectedShipmentForConfirm] =
    useState<any | null>(null);

  // Incoming filters
  const [incomingFromBranch, setIncomingFromBranch] = useState("");
  const [incomingToBranch, setIncomingToBranch] = useState("");
  const [incomingDate, setIncomingDate] = useState("");

  // Load items for active shipment
  const {
    data: items = [],
    isLoading: isLoadingItems,
  } = useShipmentItems(activeShipmentId);

  // Forms
  const [shipmentForm, setShipmentForm] = useState({
    fromBranchId: "",
    toBranchId: "",
    courierCompany: "",
    courierReference: "",
    remarks: "",
  });

  const [itemForm, setItemForm] = useState({
    documentType: "POLICY",
    documentNumber: "",
    customerName: "",
    policyNumber: "",
    pageCount: "",
    remarks: "",
  });

  // Handlers
  const handleSearch = () => {
    if (!searchShipmentId.trim()) return;
    setActiveShipmentId(searchShipmentId.trim());
  };

  const handleCreateShipment = (e: React.FormEvent) => {
    e.preventDefault();

    const shipment: CreateShipmentRequest = {
      fromBranchId: Number(shipmentForm.fromBranchId),
      toBranchId: Number(shipmentForm.toBranchId),
      courierCompany: shipmentForm.courierCompany,
      courierReference: shipmentForm.courierReference,
      remarks: shipmentForm.remarks,
    };

    createShipmentMutation.mutate(shipment, {
      onSuccess: (response: any) => {
        const shipmentId = String(
          response.id ?? response.shipmentId ?? response
        );
        setActiveShipmentId(shipmentId);
        setSearchShipmentId(shipmentId);
        setShipmentForm({
          fromBranchId: "",
          toBranchId: "",
          courierCompany: "",
          courierReference: "",
          remarks: "",
        });
        setActiveTab("ADD_ITEMS");
      },
    });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeShipmentId) return;

    const item: ShipmentItemRequest = {
      documentType: itemForm.documentType as
        | "POLICY"
        | "CLAIM"
        | "ENDORSEMENT"
        | "OTHER",
      documentNumber: itemForm.documentNumber,
      customerName: itemForm.customerName,
      policyNumber: itemForm.policyNumber,
      pageCount: Number(itemForm.pageCount),
      remarks: itemForm.remarks,
    };

    addShipmentItemMutation.mutate(
      { shipmentId: activeShipmentId, itemData: item },
      {
        onSuccess: () => {
          setItemForm({
            documentType: "POLICY",
            documentNumber: "",
            customerName: "",
            policyNumber: "",
            pageCount: "",
            remarks: "",
          });
        },
      }
    );
  };

  // Incoming filtered list
  const filteredIncoming = useMemo(() => {
    return (incomingShipments as any[]).filter((s) => {
      const fromMatch =
        !incomingFromBranch ||
        String(s.fromBranch ?? s.fromBranchId ?? "")
          .toLowerCase()
          .includes(incomingFromBranch.toLowerCase());

      const toMatch =
        !incomingToBranch ||
        String(s.toBranch ?? s.toBranchId ?? "")
          .toLowerCase()
          .includes(incomingToBranch.toLowerCase());

      const dateMatch =
        !incomingDate ||
        (s.sentDate &&
          String(s.sentDate).slice(0, 10) === incomingDate);

      return fromMatch && toMatch && dateMatch;
    });
  }, [incomingShipments, incomingFromBranch, incomingToBranch, incomingDate]);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

  const tabs: { id: ViewMode; label: string }[] = [
    { id: "CREATE", label: "Create Shipment" },
    { id: "ADD_ITEMS", label: "Add Items" },
    { id: "VIEW_ALL", label: "All Shipments" },
    { id: "INCOMING", label: "Incoming Files" },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Header + Tabs ──────────────────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Courier File Transfer
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Create, track and manage inter-branch document shipments
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Global Alerts */}
      {createShipmentMutation.error && (
        <Alert type="error">
          {(createShipmentMutation.error as Error).message}
        </Alert>
      )}
      {addShipmentItemMutation.error && (
        <Alert type="error">
          {(addShipmentItemMutation.error as Error).message}
        </Alert>
      )}
      {createShipmentMutation.isSuccess && (
        <Alert type="success">
          Shipment created successfully! Switched to items entry mode.
        </Alert>
      )}
      {addShipmentItemMutation.isSuccess && (
        <Alert type="success">Item added successfully!</Alert>
      )}

      {/* ─── CREATE ─────────────────────────────────────────────────── */}
      {activeTab === "CREATE" && (
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h3 className="mb-5 text-lg font-semibold text-slate-900">
            Create New Courier Shipment
          </h3>

          <form onSubmit={handleCreateShipment} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  From Branch ID *
                </label>
                <input
                  type="number"
                  required
                  value={shipmentForm.fromBranchId}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      fromBranchId: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  To Branch ID *
                </label>
                <input
                  type="number"
                  required
                  value={shipmentForm.toBranchId}
                  onChange={(e) =>
                    setShipmentForm({
                      ...shipmentForm,
                      toBranchId: e.target.value,
                    })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Courier Company *
              </label>
              <input
                type="text"
                required
                value={shipmentForm.courierCompany}
                onChange={(e) =>
                  setShipmentForm({
                    ...shipmentForm,
                    courierCompany: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Courier Reference / Tracking No *
              </label>
              <input
                type="text"
                required
                value={shipmentForm.courierReference}
                onChange={(e) =>
                  setShipmentForm({
                    ...shipmentForm,
                    courierReference: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Remarks
              </label>
              <textarea
                rows={2}
                value={shipmentForm.remarks}
                onChange={(e) =>
                  setShipmentForm({
                    ...shipmentForm,
                    remarks: e.target.value,
                  })
                }
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={createShipmentMutation.isPending}
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {createShipmentMutation.isPending
                ? "Creating…"
                : "Create Shipment & Proceed to Items"}
            </button>
          </form>
        </div>
      )}

      {/* ─── ADD ITEMS ──────────────────────────────────────────────── */}
      {activeTab === "ADD_ITEMS" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">
              Lookup Shipment
            </h3>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                placeholder="Enter Shipment ID"
                value={searchShipmentId}
                onChange={(e) => setSearchShipmentId(e.target.value)}
                className={`${inputClass} sm:max-w-xs`}
              />
              <button
                onClick={handleSearch}
                disabled={isLoadingItems}
                className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60"
              >
                {isLoadingItems ? "Loading…" : "Load Shipment"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Add Item Form */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  Add Item
                </h3>
                {activeShipmentId ? (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 font-mono text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                    ID: {activeShipmentId}
                  </span>
                ) : (
                  <span className="text-xs text-amber-600">
                    Load a shipment first
                  </span>
                )}
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Document Type
                    </label>
                    <select
                      value={itemForm.documentType}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          documentType: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="POLICY">POLICY</option>
                      <option value="CLAIM">CLAIM</option>
                      <option value="ENDORSEMENT">ENDORSEMENT</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Document Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={itemForm.documentNumber}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          documentNumber: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={itemForm.customerName}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          customerName: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Policy Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={itemForm.policyNumber}
                      onChange={(e) =>
                        setItemForm({
                          ...itemForm,
                          policyNumber: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Page Count *
                  </label>
                  <input
                    type="number"
                    required
                    value={itemForm.pageCount}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        pageCount: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Remarks
                  </label>
                  <textarea
                    rows={2}
                    value={itemForm.remarks}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        remarks: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    addShipmentItemMutation.isPending || !activeShipmentId
                  }
                  className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {addShipmentItemMutation.isPending
                    ? "Adding…"
                    : "Add Item to Shipment"}
                </button>
              </form>
            </div>

            {/* Items Table */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">
                Items in Shipment{" "}
                {activeShipmentId && (
                  <span className="text-sm font-normal text-slate-500">
                    #{activeShipmentId}
                  </span>
                )}
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                  <thead>
                    <tr className="bg-slate-50/80">
                      <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Type
                      </th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Doc No
                      </th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Customer
                      </th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Policy
                      </th>
                      <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Pages
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items?.length ? (
                      items.map((item: any, index: number) => (
                        <tr key={item.id ?? index} className="hover:bg-slate-50/70">
                          <td className="px-3 py-2.5 font-medium text-slate-800">
                            {item.documentType}
                          </td>
                          <td className="px-3 py-2.5">{item.documentNumber}</td>
                          <td className="px-3 py-2.5">{item.customerName}</td>
                          <td className="px-3 py-2.5">{item.policyNumber}</td>
                          <td className="px-3 py-2.5">{item.pageCount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-3 py-8 text-center text-slate-400"
                        >
                          {activeShipmentId
                            ? "No items added yet."
                            : "Load a shipment to view items."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── VIEW ALL ───────────────────────────────────────────────── */}
      {activeTab === "VIEW_ALL" && (
        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                All Courier Shipments
              </h3>
              <p className="text-sm text-slate-500">
                Manage and confirm dispatch status for outward shipments
              </p>
            </div>
            <button
              onClick={() => refetchAllShipments?.()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    ID
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    From
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    To
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Courier
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Ref
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
                {isLoadingAll ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400">
                      Loading shipments…
                    </td>
                  </tr>
                ) : allShipments?.length ? (
                  allShipments.map((shipment: any, index: number) => {
                    const id = String(
                      shipment.id ?? shipment.shipmentId ?? index
                    );
                    const status = String(shipment.status || "").toUpperCase();
                    const isDispatched =
                      status === "DISPATCHED" ||
                      status === "DISPATCH" ||
                      status === "SENT";
                    const isPending =
                      status === "PENDING_DELIVERY" || status === "PENDING";

                    return (
                      <tr key={`${id}-${index}`} className="hover:bg-slate-50/70">
                        <td className="px-5 py-3.5 font-semibold text-slate-900">
                          #{id}
                        </td>
                        <td className="px-5 py-3.5 text-sm">
                          {shipment.fromBranchName ??
                            `Branch ${shipment.fromBranchId}`}
                        </td>
                        <td className="px-5 py-3.5 text-sm">
                          {shipment.toBranchName ??
                            `Branch ${shipment.toBranchId}`}
                        </td>
                        <td className="px-5 py-3.5 text-sm">
                          {shipment.courierCompany}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                          {shipment.courierReference}
                        </td>
                        <td className="px-5 py-3.5">
                          {isDispatched ? (
                            <StatusBadge color="blue">Dispatched</StatusBadge>
                          ) : isPending ? (
                            <StatusBadge color="amber">
                              Pending Delivery
                            </StatusBadge>
                          ) : (
                            <StatusBadge color="slate">Draft</StatusBadge>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setActiveShipmentId(id);
                                setSearchShipmentId(id);
                                setActiveTab("ADD_ITEMS");
                              }}
                              className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Edit
                            </button>
                            {isDispatched ? (
                              <button
                                disabled
                                className="cursor-not-allowed rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-600 opacity-70"
                              >
                                Dispatched
                              </button>
                            ) : isPending ? (
                              <button
                                disabled
                                className="cursor-not-allowed rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-600 opacity-70"
                              >
                                Pending
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  setSelectedShipmentForConfirm(shipment)
                                }
                                className="rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                              >
                                Confirm
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400">
                      No courier shipments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── INCOMING FILES (NEW) ───────────────────────────────────── */}
      {activeTab === "INCOMING" && (
        <div className="space-y-5">
          {/* Filters */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Incoming Files
                </h3>
                <p className="text-sm text-slate-500">
                  Shipments arriving at your branch
                </p>
              </div>
              <button
                onClick={() => refetchIncoming?.()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  From Branch
                </label>
                <input
                  type="text"
                  placeholder="Filter by from branch…"
                  value={incomingFromBranch}
                  onChange={(e) => setIncomingFromBranch(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  To Branch
                </label>
                <input
                  type="text"
                  placeholder="Filter by to branch…"
                  value={incomingToBranch}
                  onChange={(e) => setIncomingToBranch(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-600">
                  Sent Date
                </label>
                <input
                  type="date"
                  value={incomingDate}
                  onChange={(e) => setIncomingDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Incoming Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr className="bg-slate-50/80">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Tracking
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      From
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      To
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Sent By
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Sent Date
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Courier
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingIncoming ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-emerald-600 border-t-transparent" />
                          <p className="text-sm text-slate-500">
                            Loading incoming shipments…
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : filteredIncoming.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center">
                          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                            <svg
                              className="h-7 w-7 text-slate-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                              />
                            </svg>
                          </div>
                          <h3 className="text-base font-semibold text-slate-800">
                            No incoming shipments
                          </h3>
                          <p className="mt-1.5 text-sm text-slate-500">
                            {incomingFromBranch ||
                            incomingToBranch ||
                            incomingDate
                              ? "Try adjusting your filters."
                              : "There are currently no incoming files."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredIncoming.map((s: any, index: number) => (
                      <tr
                        key={s.id ?? s.trackingNumber ?? index}
                        className="hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-3.5 font-semibold text-slate-900">
                          {s.trackingNumber ?? s.courierReference ?? `#${s.id}`}
                        </td>
                        <td className="px-5 py-3.5 text-sm">
                          {s.fromBranch ?? s.fromBranchName ?? "—"}
                        </td>
                        <td className="px-5 py-3.5 text-sm">
                          {s.toBranch ?? s.toBranchName ?? "—"}
                        </td>
                        <td className="px-5 py-3.5 text-sm">
                          {s.sentBy ?? "—"}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-slate-600">
                          {s.sentDate
                            ? new Date(s.sentDate).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-5 py-3.5 text-sm">
                          {s.courierCompany ?? "—"}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge
                            color={
                              String(s.status || "")
                                .toUpperCase()
                                .includes("DISPATCH")
                                ? "blue"
                                : String(s.status || "")
                                    .toUpperCase()
                                    .includes("PENDING")
                                ? "amber"
                                : "slate"
                            }
                          >
                            {s.status ?? "Unknown"}
                          </StatusBadge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {selectedShipmentForConfirm && (
        <ConfirmShipmentModal
          shipment={selectedShipmentForConfirm}
          onClose={() => setSelectedShipmentForConfirm(null)}
        />
      )}
    </div>
  );
}

/* ─── Helpers ──────────────────────────────────────────────────────── */

function Alert({
  type,
  children,
}: {
  type: "error" | "success";
  children: React.ReactNode;
}) {
  const styles =
    type === "error"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}

function StatusBadge({
  color,
  children,
}: {
  color: "blue" | "amber" | "slate" | "emerald";
  children: React.ReactNode;
}) {
  const map = {
    blue: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    amber: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    slate: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${map[color]}`}
    >
      {children}
    </span>
  );
}