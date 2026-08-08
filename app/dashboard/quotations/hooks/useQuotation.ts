// hooks/useQuotation.ts

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { quotationService } from "../../../services/quatation.service";

import {
  CreateQuotationRequest,
} from "../../../lib/types/quatation";

const QUERY_KEY = ["quotations"];

/**
 * Get all quotations
 */
export const useQuotations = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: quotationService.getAll,
  });
};

/**
 * Get quotation by id
 */
export const useQuotation = (id: number) => {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => quotationService.getById(id),
    enabled: !!id,
  });
};

/**
 * Create quotation
 */
export const useCreateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      request: CreateQuotationRequest
    ) => quotationService.create(request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
};

/**
 * Update quotation
 */
export const useUpdateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: CreateQuotationRequest;
    }) =>
      quotationService.update(id, request),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEY, variables.id],
      });
    },
  });
};

/**
 * Delete quotation
 */
export const useDeleteQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      quotationService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
};

/**
 * Calculate premium
 */
export const useCalculateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      quotationService.calculate(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEY, id],
      });
    },
  });
};

/**
 * Approve quotation
 */
export const useApproveQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      quotationService.approve(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEY, id],
      });
    },
  });
};

/**
 * Reject quotation
 */
export const useRejectQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      reason,
    }: {
      id: number;
      reason: string;
    }) =>
      quotationService.reject(id, reason),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEY, variables.id],
      });
    },
  });
};

/**
 * Issue quotation
 */
export const useIssueQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      quotationService.issue(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEY, id],
      });
    },
  });
};

/**
 * Duplicate quotation
 */
export const useDuplicateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      quotationService.duplicate(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });
    },
  });
};

/**
 * Download quotation PDF
 */
export const useDownloadQuotationPdf = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const blob = await quotationService.downloadPdf(id);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download = `quotation-${id}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    },
  });
};