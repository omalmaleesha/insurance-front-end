export enum ClaimType {
  MOTOR = "MOTOR",
  HEALTH = "HEALTH",
  PROPERTY = "PROPERTY",
  FIRE = "FIRE",
  TRAVEL = "TRAVEL",
  OTHER = "OTHER",
  BUSINESS_PREMISES = "BUSINESS_PREMISES",
  INDUSTRIAL_PREMISES = "INDUSTRIAL_PREMISES",
  PRIVATE_HOUSE = "PRIVATE_HOUSE",
}

export enum ClaimStatus {
  REPORTED = "REPORTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CLOSED = "CLOSED",
}

export interface ClaimCreateRequest {
  customerId: number;
  policyNumber: string;
  claimType: ClaimType;
  incidentDate: string;
  incidentLocation: string;
  incidentDescription: string;
  situationStatement?: string;
  createdByEtfNo: string;
  branchCode: string;
}

export interface ClaimUpdateRequest {
  claimType: ClaimType;
  incidentDate: string;
  incidentLocation: string;
  incidentDescription: string;
  situationStatement?: string;
  branchCode: string;
}

export interface Claim {
  id: number;
  claimNumber: string;
  customerId: number;
  createdByEtfNo: string;
  claimType: ClaimType;
  status: ClaimStatus;
  incidentDate: string;
  reportedDate: string;
  incidentLocation: string;
  incidentDescription: string;
  situationStatement?: string;
  branchCode: string;
  createdAt: string;
  updatedAt: string;
}

