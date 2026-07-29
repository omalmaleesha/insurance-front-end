"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dispatchShipment } from "../services/fileTransfer.service";

export function useDispatchShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dispatchShipment,

    onSuccess: () => {
      // Refresh shipment history
      queryClient.invalidateQueries({
        queryKey: ["shipment-history"],
      });

      // Refresh shipment items if they're displayed
      queryClient.invalidateQueries({
        queryKey: ["shipment-items"],
      });
    },
  });
}