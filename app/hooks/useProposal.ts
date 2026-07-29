import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { proposalService } from "../services/proposal.service";

import {
  CreateProposalRequest,
} from "../lib/types/proposal";

const QUERY_KEY = ["proposals"];

export const useProposals = () => {

  return useQuery({

    queryKey: QUERY_KEY,

    queryFn: proposalService.getAll,

  });

};

export const useProposal = (id: number) => {

  return useQuery({

    queryKey: [...QUERY_KEY, id],

    queryFn: () => proposalService.getById(id),

    enabled: !!id,

  });

};

export const useCreateProposal = () => {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: (
      request: CreateProposalRequest
    ) => proposalService.create(request),

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

    },

  });

};

export const useSendProposal = () => {

  const queryClient = useQueryClient();

  return useMutation({

    mutationFn: (proposalId: number) =>
      proposalService.sendProposal(proposalId),

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: QUERY_KEY,
      });

    },

  });

};

export const useResendProposal = () => {

  return useMutation({

    mutationFn: (proposalId: number) =>
      proposalService.resendProposal(proposalId),

  });

};