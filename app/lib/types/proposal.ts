export type ProposalStatus =
  | "DRAFT"
  | "EMAIL_SENT"
  | "OPENED"
  | "SUBMITTED";

export interface Proposal {
  id: number;
  proposalNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  status: ProposalStatus;
}
export interface ProposalFormRequest {
  token: string;

  customerName: string;

  customerPhone: string;

  address: string;

  dateOfBirth: string; // ISO format: yyyy-MM-dd

  nic: string;

  occupation: string;

  signatureBase64: string;
}

export interface CreateProposalRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
}

export interface ProposalFormResponse {
  proposalNumber: string;
  customerName: string;
  customerEmail: string;
  status: ProposalStatus;
}

export interface EmailResponse {
  success: boolean;
  message: string;
}