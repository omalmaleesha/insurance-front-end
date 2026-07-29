"use client";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { createShipment } from "../services/fileTransfer.service";

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createShipment,

    onSuccess: (shipment) => {
      queryClient.invalidateQueries({
        queryKey: ["shipments"],
      });

      if (shipment.id) {
        queryClient.invalidateQueries({
          queryKey: ["shipment-items", shipment.id],
        });
      }
    },
  });
}