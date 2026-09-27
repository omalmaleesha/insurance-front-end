import {
  Claim,
  ClaimCreateRequest,
  ClaimUpdateRequest,
} from "../lib/types/claim";

import api from "../lib/apiClient";

const BASE = "/api/claims";

export const getAllClaims = async (): Promise<Claim[]> => {
  const response = await api.get<Claim[]>(BASE);
  return response.data;
};

export const getClaimById = async (id: number): Promise<Claim> => {
  const response = await api.get<Claim>(`${BASE}/${id}`);
  return response.data;
};

export const getClaimByNumber = async (
  claimNumber: string
): Promise<Claim> => {
  const response = await api.get<Claim>(
    `${BASE}/number/${encodeURIComponent(claimNumber)}`
  );
  return response.data;
};

export const getClaimsByCustomer = async (
  customerId: number
): Promise<Claim[]> => {
  const response = await api.get<Claim[]>(
    `${BASE}/customer/${customerId}`
  );
  return response.data;
};

export const createClaim = async (
  data: ClaimCreateRequest
): Promise<Claim> => {
  const response = await api.post<Claim>(BASE, data);
  return response.data;
};

export const updateClaim = async (
  id: number,
  data: ClaimUpdateRequest
): Promise<Claim> => {
  const response = await api.put<Claim>(`${BASE}/${id}`, data);
  return response.data;
};

export const deleteClaim = async (id: number): Promise<void> => {
  await api.delete(`${BASE}/${id}`);
};

