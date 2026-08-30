export enum ClaimType {
  MOTOR = "MOTOR",
  PROPERTY = "PROPERTY",
  HEALTH = "HEALTH",
  TRAVEL = "TRAVEL",
  OTHER = "OTHER",
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
  createdByEtfNo: string;
  claimType: ClaimType;
  incidentDate: string; // ISO datetime
  incidentLocation: string;
  incidentDescription: string;
  situationStatement?: string;
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