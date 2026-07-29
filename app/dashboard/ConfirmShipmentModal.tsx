"use client";

import React from "react";
import { useShipmentItems } from "../hooks/useShipmentItems";
import { useDispatchShipment } from "../hooks/useDispatchShipment"; // Adjust import path

interface ConfirmShipmentModalProps {
  shipment: any;
  onClose: () => void;
}

export function ConfirmShipmentModal({
  shipment,
  onClose,
}: ConfirmShipmentModalProps) {
  const shipmentId = String(shipment.id ?? shipment.shipmentId ?? "");

  // 1. Fetch Items Hook
  const { data: itemsResponse, isLoading, isError } = useShipmentItems(shipmentId);

  // 2. Dispatch Shipment Mutation Hook
  const { mutate: dispatch, isPending: isDispatching } = useDispatchShipment();

  // Handle items payload variations safely
  const items = Array.isArray(itemsResponse)
    ? itemsResponse
    : itemsResponse?.items || itemsResponse?.data || [];

  const handleSendDelivery = () => {
    // Ensure payload matches expected shape: { shipmentId: number, data: DispatchShipmentRequest }
    const payload = { shipmentId: Number(shipmentId), data: {} as any };

    dispatch(payload, {
      onSuccess: () => {
        alert(`Delivery Sent Successfully for Shipment #${shipmentId}!`);
        onClose();
      },
      onError: (error: any) => {
        alert(
          `Failed to dispatch shipment: ${
            error?.response?.data?.message || error.message || "Unknown error"
          }`
        );
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <h4 className="text-base font-semibold text-slate-800">
            Confirm Shipment #{shipmentId}
          </h4>
          <button
            onClick={onClose}
            disabled={isDispatching}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Info */}
        <div className="mb-4 space-y-1 text-xs text-gray-600">
          <p>
            <strong>Courier:</strong> {shipment.courierCompany}
          </p>
          <p>
            <strong>Reference #:</strong> {shipment.courierReference}
          </p>
        </div>

        <h5 className="mb-2 text-xs font-semibold uppercase text-gray-500">
          Items in this Shipment:
        </h5>

        {/* Items List */}
        <div className="mb-6 max-h-48 overflow-y-auto rounded-lg border bg-gray-50 p-3">
          {isLoading ? (
            <p className="py-2 text-center text-xs text-gray-400">
              Loading shipment items...
            </p>
          ) : isError ? (
            <p className="py-2 text-center text-xs text-red-500">
              Failed to load items for this shipment.
            </p>
          ) : items.length > 0 ? (
            <ul className="divide-y divide-gray-200 text-xs text-gray-700">
              {items.map((item: any, i: number) => (
                <li key={item.id ?? i} className="py-2 flex justify-between">
                  <span>
                    {item.fileName ||
                      item.description ||
                      `File Ref: ${item.fileId}`}
                  </span>
                  <span className="font-medium text-gray-500">
                    Qty: {item.quantity || 1}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-2 text-center text-xs text-gray-400">
              No items attached to this shipment yet.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            onClick={onClose}
            disabled={isDispatching}
            className="rounded-lg border px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSendDelivery}
            disabled={isDispatching || items.length === 0}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 disabled:opacity-50"
          >
            {isDispatching ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Dispatching...
              </>
            ) : (
              "Send Delivery"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}