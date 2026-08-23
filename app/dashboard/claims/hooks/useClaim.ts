import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createClaim,
  deleteClaim,
  getAllClaims,
  getClaimById,
  getClaimByNumber,
  getClaimsByCustomer,
  updateClaim,
} from "../../../services/claim.service";
import {
  ClaimCreateRequest,
  ClaimUpdateRequest,
} from "../../../lib/types/claim";

export const claimKeys = {
  all: ["claims"] as const,
  detail: (id: number) => ["claims", id] as const,
  number: (n: string) => ["claims", "number", n] as const,
  customer: (id: number) => ["claims", "customer", id] as const,
};

export function useClaims() {
  return useQuery({
    queryKey: claimKeys.all,
    queryFn: getAllClaims,
  });
}

export function useClaim(id: number) {
  return useQuery({
    queryKey: claimKeys.detail(id),
    queryFn: () => getClaimById(id),
    enabled: !!id && id > 0,
  });
}

export function useClaimByNumber(claimNumber: string) {
  return useQuery({
    queryKey: claimKeys.number(claimNumber),
    queryFn: () => getClaimByNumber(claimNumber),
    enabled: claimNumber.trim().length > 0,
  });
}

export function useClaimsByCustomer(customerId: number) {
  return useQuery({
    queryKey: claimKeys.customer(customerId),
    queryFn: () => getClaimsByCustomer(customerId),
    enabled: !!customerId,
  });
}

export function useCreateClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ClaimCreateRequest) => createClaim(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: claimKeys.all });
    },
  });
}

export function useUpdateClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ClaimUpdateRequest }) =>
      updateClaim(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: claimKeys.all });
      qc.invalidateQueries({ queryKey: claimKeys.detail(id) });
    },
  });
}

export function useDeleteClaim() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteClaim(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: claimKeys.all });
    },
  });
}