import api from "../lib/apiClient";
import {
  CreateShipmentRequest,
  ShipmentItemRequest,
  DispatchShipmentRequest,
  ShipmentResponse,
} from "../lib/types/shipment";

export const createShipment = async (
  data: CreateShipmentRequest
) => {
  const res = await api.post(
    "/api/file-transfer/shipments",
    data
  );

  return res.data;
};

export const getShipmentItems = async (
  shipmentId: string
) => {
  const res = await api.get(
    `/api/file-transfer/shipments/${shipmentId}/items`
  );

  return res.data;
};

export const addShipmentItem = async ({
  shipmentId,
  itemData,
}: {
  shipmentId: string;
  itemData: ShipmentItemRequest;
}) => {
  const res = await api.post(
    `/api/file-transfer/shipments/${shipmentId}/items`,
    itemData
  );

  return res.data;
};

export const getShipmentHistory = async (): Promise<ShipmentResponse[]> => {
  const res = await api.get("/api/file-transfer/shipments/history");
  return res.data;
};


export const dispatchShipment = async ({
  shipmentId,
  data,
}: {
  shipmentId: number;
  data: DispatchShipmentRequest;
}): Promise<ShipmentResponse> => {
  const res = await api.put(
    `/api/file-transfer/shipments/${shipmentId}/dispatch`,
    data
  );

  return res.data;
};

export const getIncomingShipments = async (): Promise<ShipmentResponse[]> => {
  const res = await api.get("/api/file-transfer/shipments/incoming");
  return res.data;
};