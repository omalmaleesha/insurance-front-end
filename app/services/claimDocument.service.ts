import api from "../lib/apiClient";

import {
  ClaimDocument,
  UploadClaimDocumentRequest,
  GReportResponse,
} from "../lib/types/claimDocument";

export const claimDocumentService = {
  // =========================================================
  // UPLOAD DOCUMENT
  // =========================================================

  uploadDocument: async (
    claimId: number,
    data: UploadClaimDocumentRequest
  ): Promise<ClaimDocument> => {
    const formData = new FormData();

    formData.append("file", data.file);

    formData.append(
      "documentType",
      data.documentType
    );

    formData.append(
      "documentSource",
      data.documentSource
    );

    formData.append(
      "uploadedByEtfNo",
      data.uploadedByEtfNo
    );

    const response = await api.post(
      `/api/claims/${claimId}/documents`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },

  // =========================================================
  // GET DOCUMENTS FOR CLAIM
  // =========================================================

  getDocumentsByClaimId: async (
    claimId: number
  ): Promise<ClaimDocument[]> => {
    const response = await api.get(
      `/api/claims/${claimId}/documents`
    );

    return response.data;
  },

  // =========================================================
  // GET DOCUMENT METADATA
  // =========================================================

  getDocumentById: async (
    documentId: number
  ): Promise<ClaimDocument> => {
    const response = await api.get(
      `/api/claims/documents/${documentId}`
    );

    return response.data;
  },

  // =========================================================
  // VIEW DOCUMENT
  //
  // GET /api/claims/documents/{documentId}/view
  // =========================================================

  getDocumentViewUrl: (
    documentId: number
  ): string => {
    return `/api/claims/documents/${documentId}/view`;
  },

  // =========================================================
  // DOWNLOAD DOCUMENT
  // =========================================================

  downloadDocument: async (
    documentId: number
  ): Promise<Blob> => {
    const response = await api.get(
      `/api/claims/documents/${documentId}/view`,
      {
        responseType: "blob",
      }
    );

    return response.data;
  },

  // =========================================================
  // VERIFY DOCUMENT
  // =========================================================

  verifyDocument: async (
    documentId: number
  ): Promise<ClaimDocument> => {
    const response = await api.patch(
      `/api/claims/documents/${documentId}/verify`
    );

    return response.data;
  },

  // =========================================================
  // REJECT DOCUMENT
  // =========================================================

  rejectDocument: async (
    documentId: number,
    reason: string
  ): Promise<ClaimDocument> => {
    const response = await api.patch(
      `/api/claims/documents/${documentId}/reject`,
      null,
      {
        params: {
          reason,
        },
      }
    );

    return response.data;
  },

  // =========================================================
  // DELETE DOCUMENT
  // =========================================================

  deleteDocument: async (
    documentId: number
  ): Promise<void> => {
    await api.delete(
      `/api/claims/documents/${documentId}`
    );
  },


  getGReport: async (
    claimId: number
  ): Promise<GReportResponse> => {
    const response = await api.get<GReportResponse>(
      `/api/claims/${claimId}/g-report`
    );

    return response.data;
  },

  
};