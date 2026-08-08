// src/hooks/customer.hooks.ts

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createCorporateCustomer,
  createPersonalCustomer,
  deleteCustomer,
  getAllCustomers,
  getCustomerByCode,
  getCustomerByEmail,
  getCustomerById,
  getCustomersByStatus,
  getCustomersByType,
  searchCustomers,
  updateCorporateCustomer,
  updatePersonalCustomer,
} from "../../../services/customer.service";
import {
  CorporateCustomerCreateRequest,
  CorporateCustomerUpdateRequest,
  CustomerType,
  PersonalCustomerCreateRequest,
  PersonalCustomerUpdateRequest,
  Status,
} from "../../../lib/types/customer";

// =======================================
// QUERY KEYS
// =======================================

export const customerKeys = {
  all: ["customers"] as const,
  detail: (id: number) => ["customers", id] as const,
  code: (code: string) => ["customers", "code", code] as const,
  email: (email: string) => ["customers", "email", email] as const,
  search: (keyword: string) =>
    ["customers", "search", keyword] as const,
  type: (type: CustomerType) =>
    ["customers", "type", type] as const,
  status: (status: Status) =>
    ["customers", "status", status] as const,
};

// =======================================
// QUERIES
// =======================================

export function useCustomers() {
  return useQuery({
    queryKey: customerKeys.all,
    queryFn: getAllCustomers,
  });
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => getCustomerById(id),
    enabled: !!id,
  });
}

export function useCustomerByCode(code: string) {
  return useQuery({
    queryKey: customerKeys.code(code),
    queryFn: () => getCustomerByCode(code),
    enabled: !!code,
  });
}

export function useCustomerByEmail(email: string) {
  return useQuery({
    queryKey: customerKeys.email(email),
    queryFn: () => getCustomerByEmail(email),
    enabled: !!email,
  });
}

export function useCustomersByType(type: CustomerType) {
  return useQuery({
    queryKey: customerKeys.type(type),
    queryFn: () => getCustomersByType(type),
    enabled: !!type,
  });
}

export function useCustomersByStatus(status: Status) {
  return useQuery({
    queryKey: customerKeys.status(status),
    queryFn: () => getCustomersByStatus(status),
    enabled: !!status,
  });
}

export function useSearchCustomers(keyword: string) {
  return useQuery({
    queryKey: customerKeys.search(keyword),
    queryFn: () => searchCustomers(keyword),
    enabled: keyword.trim().length > 0,
  });
}

// =======================================
// MUTATIONS
// =======================================

export function useCreatePersonalCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PersonalCustomerCreateRequest) =>
      createPersonalCustomer(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.all,
      });
    },
  });
}

export function useCreateCorporateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CorporateCustomerCreateRequest) =>
      createCorporateCustomer(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.all,
      });
    },
  });
}

export function useUpdatePersonalCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: PersonalCustomerUpdateRequest;
    }) => updatePersonalCustomer(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.all,
      });
    },
  });
}

export function useUpdateCorporateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CorporateCustomerUpdateRequest;
    }) => updateCorporateCustomer(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.all,
      });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCustomer(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: customerKeys.all,
      });
    },
  });
}