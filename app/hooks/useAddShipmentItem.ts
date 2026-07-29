"use client";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { addShipmentItem } from "../services/fileTransfer.service";

export function useAddShipmentItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addShipmentItem,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "shipment-items",
          variables.shipmentId,
        ],
      });
    },
  });
}