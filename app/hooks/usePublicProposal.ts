import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import { publicProposalService } from "../services/proposalPublic.service";

import {
  ProposalFormRequest,
} from "../lib/types/proposal";

export const usePublicProposal = (
  token?: string
) => {

  return useQuery({

    queryKey: ["public-proposal", token],

    queryFn: () =>
      publicProposalService.getProposalForm(token!),

    enabled: !!token,

    retry: false,

  });

};

export const useSubmitProposal = () => {

  return useMutation({

    mutationFn: (
      request: ProposalFormRequest
    ) =>
      publicProposalService.submitProposal(
        request
      ),

  });

};