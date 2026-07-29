"use client";

import { useState } from "react";

import { useCreateShipment } from "../hooks/useCreateShipment";
import { useShipmentItems } from "../hooks/useShipmentItems";
import { useAddShipmentItem } from "../hooks/useAddShipmentItem";
// Import your hook for fetching all shipments when ready:
import { useAllShipments } from "../hooks/useAllShipments";

import type {
  CreateShipmentRequest,
  ShipmentItemRequest,
} from "../lib/types/shipment";
import { ConfirmShipmentModal } from "./ConfirmShipmentModal";

type ViewMode = "CREATE" | "ADD_ITEMS" | "VIEW_ALL";

export default function FileTransferTracking() {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<ViewMode>("CREATE");

  // React Query Hooks
  const createShipmentMutation = useCreateShipment();
  const addShipmentItemMutation = useAddShipmentItem();
  const { data: allShipments = [], isLoading: isLoadingAll, refetch: refetchAllShipments } = useAllShipments();

  // Local State
  const [activeShipmentId, setActiveShipmentId] = useState("");
  const [searchShipmentId, setSearchShipmentId] = useState("");

  // Load shipment items for active shipment ID
  const {
    data: items = [],
    isLoading: isLoadingItems,
    error: itemsError,
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

  // Handle Search / Lookup
  const handleSearch = () => {
    if (!searchShipmentId.trim()) return;
    setActiveShipmentId(searchShipmentId.trim());
  };

  // Handle Create Shipment
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

        // Automatically transition to Add Items mode for the newly created shipment
        setActiveTab("ADD_ITEMS");
      },
    });
  };

  // Handle Add Item
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
      {
        shipmentId: activeShipmentId,
        itemData: item,
      },
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

  const [selectedShipmentForConfirm, setSelectedShipmentForConfirm] = useState<any | null>(null);

  // 1. Store only the selected ID for confirmation


  return (
    <div className="space-y-6">
      {/* Navigation Options Header */}
      <div className="border-b border-gray-200 bg-white p-4 shadow-sm rounded-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Courier File Transfer Management
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab("CREATE")}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "CREATE"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            + Create New Courier Shipment
          </button>

          <button
            onClick={() => setActiveTab("ADD_ITEMS")}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "ADD_ITEMS"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Add Items to Existing Shipment
          </button>

          <button
            onClick={() => setActiveTab("VIEW_ALL")}
            className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === "VIEW_ALL"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            View All Courier Shipments
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {createShipmentMutation.error && (
        <div className="rounded border border-red-200 bg-red-100 p-4 text-sm text-red-700">
          {(createShipmentMutation.error as Error).message}
        </div>
      )}

      {addShipmentItemMutation.error && (
        <div className="rounded border border-red-200 bg-red-100 p-4 text-sm text-red-700">
          {(addShipmentItemMutation.error as Error).message}
        </div>
      )}

      {createShipmentMutation.isSuccess && (
        <div className="rounded border border-emerald-200 bg-emerald-100 p-4 text-sm text-emerald-800">
          Shipment created successfully! Switched to items entry mode.
        </div>
      )}

      {addShipmentItemMutation.isSuccess && (
        <div className="rounded border border-emerald-200 bg-emerald-100 p-4 text-sm text-emerald-800">
          Item added successfully!
        </div>
      )}

      {/* OPTION 1: CREATE NEW SHIPMENT */}
      {activeTab === "CREATE" && (
        <div className="mx-auto max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Create New Courier Shipment
          </h3>

          <form onSubmit={handleCreateShipment} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700">
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
                  className="mt-1 w-full rounded border p-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
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
                  className="mt-1 w-full rounded border p-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
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
                className="mt-1 w-full rounded border p-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
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
                className="mt-1 w-full rounded border p-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700">
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
                className="mt-1 w-full rounded border p-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={createShipmentMutation.isPending}
              className="w-full rounded bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-gray-400"
            >
              {createShipmentMutation.isPending
                ? "Creating..."
                : "Create Shipment & Proceed to Items"}
            </button>
          </form>
        </div>
      )}

      {/* OPTION 2: ADD ITEMS TO EXISTING SHIPMENT */}
      {activeTab === "ADD_ITEMS" && (
        <div className="space-y-6">
          {/* Lookup Shipment Header */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-gray-800">
              Lookup Shipment
            </h3>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter Shipment ID"
                value={searchShipmentId}
                onChange={(e) => setSearchShipmentId(e.target.value)}
                className="w-64 rounded border p-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={handleSearch}
                disabled={isLoadingItems}
                className="rounded bg-slate-800 px-5 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:bg-gray-400"
              >
                {isLoadingItems ? "Loading..." : "Load Shipment"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Form: Add Item */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Add Item Fields
                </h3>
                {activeShipmentId ? (
                  <span className="rounded bg-emerald-100 px-2.5 py-1 font-mono text-xs font-semibold text-emerald-800">
                    Active ID: {activeShipmentId}
                  </span>
                ) : (
                  <span className="text-xs text-amber-600">
                    * Please search/load a shipment ID first
                  </span>
                )}
              </div>

              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
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
                      className="mt-1 w-full rounded border p-2 text-sm"
                    >
                      <option value="POLICY">POLICY</option>
                      <option value="CLAIM">CLAIM</option>
                      <option value="ENDORSEMENT">ENDORSEMENT</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
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
                      className="mt-1 w-full rounded border p-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
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
                      className="mt-1 w-full rounded border p-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700">
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
                      className="mt-1 w-full rounded border p-2 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
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
                    className="mt-1 w-full rounded border p-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">
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
                    className="mt-1 w-full rounded border p-2 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    addShipmentItemMutation.isPending || !activeShipmentId
                  }
                  className="w-full rounded bg-emerald-600 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:bg-gray-400"
                >
                  {addShipmentItemMutation.isPending
                    ? "Adding..."
                    : "Add Item to Shipment"}
                </button>
              </form>
            </div>

            {/* Table: Items Added Already */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Items Added Already{" "}
                {activeShipmentId && `(#${activeShipmentId})`}
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm text-gray-600">
                  <thead className="border-b bg-gray-50 text-xs uppercase text-gray-700">
                    <tr>
                      <th className="p-2.5">Doc Type</th>
                      <th className="p-2.5">Doc Number</th>
                      <th className="p-2.5">Customer Name</th>
                      <th className="p-2.5">Policy Number</th>
                      <th className="p-2.5">Pages</th>
                      <th className="p-2.5">Remarks</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {items?.length ? (
                      items.map((item: any, index: number) => (
                        <tr key={item.id ?? index}>
                          <td className="p-2.5 font-medium">{item.documentType}</td>
                          <td className="p-2.5">{item.documentNumber}</td>
                          <td className="p-2.5">{item.customerName}</td>
                          <td className="p-2.5">{item.policyNumber}</td>
                          <td className="p-2.5">{item.pageCount}</td>
                          <td className="p-2.5">{item.remarks || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-4 text-center text-gray-400"
                        >
                          {activeShipmentId
                            ? "No items added to this shipment yet."
                            : "Load a shipment ID to view added items."}
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

      {/* OPTION 3: SEE ALL COURIER SHIPMENTS VIEW */}
{activeTab === "VIEW_ALL" && (
  <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
    {/* Tab Header with Tab-Specific Button */}
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          All Courier Shipments
        </h3>
        <p className="text-xs text-gray-500">
          Manage and confirm dispatch status for outward shipments.
        </p>
      </div>

      {/* Button visible ONLY on View All tab */}
      <button
        onClick={() => refetchAllShipments && refetchAllShipments()}
        className="flex items-center gap-2 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white shadow hover:bg-slate-700"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Refresh History
      </button>
    </div>

    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm text-gray-600">
        <thead className="border-b bg-gray-50 text-xs uppercase text-gray-700">
          <tr>
            <th className="p-3">Shipment ID</th>
            <th className="p-3">From Branch</th>
            <th className="p-3">To Branch</th>
            <th className="p-3">Courier Company</th>
            <th className="p-3">Courier Ref</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
  {isLoadingAll ? (
    <tr>
      <td colSpan={7} className="p-4 text-center text-gray-400">
        Loading shipments history...
      </td>
    </tr>
  ) : allShipments?.length ? (
    allShipments.map((shipment: any, index: number) => {
      const id = String(shipment.id ?? shipment.shipmentId ?? index);

      // Normalize status string from API response (case-insensitive)
      const status = String(shipment.status || "").toUpperCase();

      const isDispatched =
        status === "DISPATCHED" ||
        status === "DISPATCH" ||
        status === "SENT";

      const isPending =
        status === "PENDING_DELIVERY" || status === "PENDING";

      return (
        <tr key={`${id}-${index}`} className="hover:bg-slate-50/50">
          <td className="p-3 font-semibold text-slate-800">#{id}</td>
          <td className="p-3">
            {shipment.fromBranchName ?? `Branch ${shipment.fromBranchId}`}
          </td>
          <td className="p-3">
            {shipment.toBranchName ?? `Branch ${shipment.toBranchId}`}
          </td>
          <td className="p-3">{shipment.courierCompany}</td>
          <td className="p-3 font-mono text-xs text-gray-500">
            {shipment.courierReference}
          </td>

          {/* STATUS COLUMN */}
          <td className="p-3">
            {isDispatched ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                Dispatched
              </span>
            ) : isPending ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                Pending Delivery
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                Draft
              </span>
            )}
          </td>

          {/* ACTIONS COLUMN */}
          <td className="p-3 text-right">
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setActiveShipmentId(id);
                  setSearchShipmentId(id);
                  setActiveTab("ADD_ITEMS");
                }}
                className="rounded border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Edit
              </button>

              {isDispatched ? (
                <button
                  disabled
                  className="cursor-not-allowed rounded bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 opacity-80"
                >
                  Dispatched
                </button>
              ) : isPending ? (
                <button
                  disabled
                  className="cursor-not-allowed rounded bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600 opacity-80"
                >
                  Pending
                </button>
              ) : (
                <button
                  onClick={() => setSelectedShipmentForConfirm(shipment)}
                  className="rounded bg-indigo-600 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition"
                >
                  Confirm Shipment
                </button>
              )}
            </div>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={7} className="p-4 text-center text-gray-400">
        No courier shipments found.
      </td>
    </tr>
  )}
</tbody>
      </table>
    </div>
  </div>
)}

{/* MODAL CALL */}
{selectedShipmentForConfirm && (
  <ConfirmShipmentModal
    shipment={selectedShipmentForConfirm}
    onClose={() => setSelectedShipmentForConfirm(null)}
  />
)}
    </div>
  );
}