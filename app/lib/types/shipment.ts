export interface CreateShipmentRequest {
  fromBranchId: number;
  toBranchId: number;
  courierCompany: string;
  courierReference: string;
  remarks: string;
}

export interface ShipmentItemRequest {
  documentType:
    | "POLICY"
    | "CLAIM"
    | "ENDORSEMENT"
    | "OTHER";

  documentNumber: string;
  customerName: string;
  policyNumber: string;
  pageCount: number;
  remarks: string;
}

export interface DispatchShipmentRequest {
  courierCompany: string;
  courierReference: string;
}

export type ShipmentStatus =
  | "CREATED"
  | "DISPATCHED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "RECEIVED"
  | "CANCELLED";

export interface ShipmentResponse {
  id: number;
  trackingNumber: string;
  fromBranch: string;
  toBranch: string;
  sentBy: string;
  sentDate: string | null;
  courierCompany: string;
  courierReference: string;
  status: ShipmentStatus;
  remarks: string;
}