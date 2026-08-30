import { useQuery } from "@tanstack/react-query";
import { getIncomingShipments } from "../../../services/fileTransfer.service";

export function useIncomingShipments() {
  return useQuery({
    queryKey: ["incoming-shipments"],
    queryFn: getIncomingShipments,
  });
}

