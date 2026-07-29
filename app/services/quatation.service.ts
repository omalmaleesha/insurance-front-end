// services/quotation.service.ts

import apiClient from "../lib/apiClient";

import {
  CreateQuotationRequest,
  QuotationResponse,
} from "../lib/types/quatation";

const BASE = "/api/quotations";

export const quotationService = {
  /**
   * Get all quotations
   */
  getAll: async (): Promise<QuotationResponse[]> => {
    const { data } = await apiClient.get(BASE);
    return data;
  },

  /**
   * Get quotation by id
   */
  getById: async (id: number): Promise<QuotationResponse> => {
    const { data } = await apiClient.get(`${BASE}/${id}`);
    return data;
  },

  /**
   * Create quotation
   */
  create: async (
    request: CreateQuotationRequest
  ): Promise<QuotationResponse> => {
    const { data } = await apiClient.post(BASE, request);
    return data;
  },

  /**
   * Update quotation
   */
  update: async (
    id: number,
    request: CreateQuotationRequest
  ): Promise<QuotationResponse> => {
    const { data } = await apiClient.put(
      `${BASE}/${id}`,
      request
    );

    return data;
  },

  /**
   * Delete quotation
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${BASE}/${id}`);
  },

  /**
   * Calculate premium
   */
  calculate: async (
    id: number
  ): Promise<QuotationResponse> => {
    const { data } = await apiClient.post(
      `${BASE}/${id}/calculate`
    );

    return data;
  },

  /**
   * Approve quotation
   */
  approve: async (
    id: number
  ): Promise<QuotationResponse> => {
    const { data } = await apiClient.post(
      `${BASE}/${id}/approve`
    );

    return data;
  },

  /**
   * Reject quotation
   */
  reject: async (
    id: number,
    reason: string
  ): Promise<QuotationResponse> => {
    const { data } = await apiClient.post(
      `${BASE}/${id}/reject`,
      null,
      {
        params: {
          reason,
        },
      }
    );

    return data;
  },

  /**
   * Issue quotation
   */
  issue: async (
    id: number
  ): Promise<QuotationResponse> => {
    const { data } = await apiClient.post(
      `${BASE}/${id}/issue`
    );

    return data;
  },

  /**
   * Duplicate quotation
   */
  duplicate: async (
    id: number
  ): Promise<QuotationResponse> => {
    const { data } = await apiClient.post(
      `${BASE}/${id}/duplicate`
    );

    return data;
  },

  /**
   * Download quotation PDF
   */
  downloadPdf: async (
    id: number
  ): Promise<Blob> => {
    const { data } = await apiClient.get(
      `${BASE}/${id}/pdf`,
      {
        responseType: "blob",
      }
    );

    return data;
  },
};