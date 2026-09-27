import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  claimDocumentService,
} from "../../../services/claimDocument.service";

import {
  UploadClaimDocumentRequest,
} from "../../../lib/types/claimDocument";


export function useClaimDocuments(
  claimId: number
) {
  return useQuery({
    queryKey: ["claim-documents", claimId],

    queryFn: () =>
      claimDocumentService.getDocumentsByClaimId(
        claimId
      ),

    enabled: !!claimId,
  });
}


export function useUploadClaimDocument(
  claimId: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: UploadClaimDocumentRequest
    ) =>
      claimDocumentService.uploadDocument(
        claimId,
        data
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["claim-documents", claimId],
      });
    },
  });
}


export function useVerifyClaimDocument(
  claimId: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: number) =>
      claimDocumentService.verifyDocument(
        documentId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["claim-documents", claimId],
      });
    },
  });
}


export function useRejectClaimDocument(
  claimId: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      documentId,
      reason,
    }: {
      documentId: number;
      reason: string;
    }) =>
      claimDocumentService.rejectDocument(
        documentId,
        reason
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["claim-documents", claimId],
      });
    },
  });
}


export function useDeleteClaimDocument(
  claimId: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: number) =>
      claimDocumentService.deleteDocument(
        documentId
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["claim-documents", claimId],
      });
    },
  });
}


export function useGReport(
  claimId: number
) {
  return useQuery({
    queryKey: ["g-report", claimId],

    queryFn: () =>
      claimDocumentService.getGReport(
        claimId
      ),

    enabled: !!claimId,
  });
}