import apiClient from "../lib/apiClient";

import {
  Proposal,
  CreateProposalRequest,
  EmailResponse,
} from "../lib/types/proposal";

const BASE = "api/proposals";

export const proposalService = {

  getAll: async (): Promise<Proposal[]> => {

    const { data } = await apiClient.get(BASE);

    return data;
  },

  getById: async (id: number): Promise<Proposal> => {

    const { data } = await apiClient.get(`${BASE}/${id}`);

    return data;
  },

  create: async (
    request: CreateProposalRequest
  ): Promise<Proposal> => {

    const { data } = await apiClient.post(BASE, request);

    return data;
  },

  sendProposal: async (
    proposalId: number
  ): Promise<EmailResponse> => {

    const { data } = await apiClient.post(
      `${BASE}/${proposalId}/send`
    );

    return data;
  },

  resendProposal: async (
    proposalId: number
  ): Promise<EmailResponse> => {

    const { data } = await apiClient.post(
      `/api/proposal-emails/resend/${proposalId}`
    );

    return data;
  },

};