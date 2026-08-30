export enum ClaimDocumentType {
  CLAIM_FORM = "CLAIM_FORM",
  CUSTOMER_STATEMENT = "CUSTOMER_STATEMENT",
  CUSTOMER_LETTER = "CUSTOMER_LETTER",
  POLICE_REPORT = "POLICE_REPORT",
  QUOTATION = "QUOTATION",
  ESTIMATE = "ESTIMATE",
  INVOICE = "INVOICE",
  VEHICLE_REGISTRATION = "VEHICLE_REGISTRATION",
  DRIVING_LICENSE = "DRIVING_LICENSE",
  PHOTOS = "PHOTOS",
  OTHER = "OTHER",
}

export enum DocumentSource {
  ONLINE_FORM = "ONLINE_FORM",
  PHYSICAL_SCAN = "PHYSICAL_SCAN",
  DIGITAL_UPLOAD = "DIGITAL_UPLOAD",
}

export enum DocumentStatus {
  PENDING = "PENDING",
  UPLOADED = "UPLOADED",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export interface ClaimDocument {
  id: number;
  claimId: number;
  documentType: string;
  documentSource: string;
  status: DocumentStatus;
  fileName: string;
  // Backend endpoint for secure viewing
  viewUrl: string;
  contentType: string;
  fileSize: number;
  uploadedByEtfNo: string;
  rejectionReason?: string | null;
  uploadedAt: string;
  updatedAt: string;
}

export interface UploadClaimDocumentRequest {
  file: File;
  documentType: string;
  documentSource: string;
  uploadedByEtfNo: string;
}