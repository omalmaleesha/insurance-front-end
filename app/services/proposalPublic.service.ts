import publicApi from "../lib/publicApiClient";

import {
  ProposalFormRequest,
  ProposalFormResponse,
} from "../lib/types/proposal";

const BASE = "/api/proposals";

export const publicProposalService = {

  getProposalForm: async (
    token: string
  ): Promise<ProposalFormResponse> => {

    const { data } = await publicApi.get(
      `${BASE}/form`,
      {
        params: {
          token,
        },
      }
    );

    return data;
  },

  submitProposal: async (
    request: ProposalFormRequest
  ): Promise<ProposalFormResponse> => {

    const { data } = await publicApi.post(
      `${BASE}/submit`,
      request
    );

    return data;
  },

};