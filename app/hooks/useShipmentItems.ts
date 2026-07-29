"use client";

import { useQuery } from "@tanstack/react-query";
import { getShipmentItems } from "../services/fileTransfer.service";

export function useShipmentItems(
  shipmentId: string
) {
  return useQuery({
    queryKey: ["shipment-items", shipmentId],

    queryFn: () =>
      getShipmentItems(shipmentId),

    enabled: !!shipmentId,
  });
}