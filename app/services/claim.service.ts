import {
  Claim,
  ClaimCreateRequest,
  ClaimUpdateRequest,
} from "../lib/types/claim";

const BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/claims`
  : "http://localhost:8080/api/claims";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const getAllClaims = () => request<Claim[]>(BASE);

export const getClaimById = (id: number) =>
  request<Claim>(`${BASE}/${id}`);

export const getClaimByNumber = (claimNumber: string) =>
  request<Claim>(`${BASE}/number/${encodeURIComponent(claimNumber)}`);

export const getClaimsByCustomer = (customerId: number) =>
  request<Claim[]>(`${BASE}/customer/${customerId}`);

export const createClaim = (data: ClaimCreateRequest) =>
  request<Claim>(BASE, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateClaim = (id: number, data: ClaimUpdateRequest) =>
  request<Claim>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteClaim = (id: number) =>
  request<void>(`${BASE}/${id}`, { method: "DELETE" });