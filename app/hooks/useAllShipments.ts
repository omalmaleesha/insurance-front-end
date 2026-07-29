"use client";

import { useQuery } from "@tanstack/react-query";
import { getShipmentHistory } from "../services/fileTransfer.service";
import { ShipmentResponse } from "../lib/types/shipment";

export function useAllShipments() {
  return useQuery<ShipmentResponse[]>({
    queryKey: ["shipment-history"],
    queryFn: getShipmentHistory,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}