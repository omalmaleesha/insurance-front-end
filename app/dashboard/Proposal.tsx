"use client";

import { useMemo, useState } from "react";

import CreateProposalModal from "./CreateProposalModal";

import {
  useCreateProposal,
  useProposals,
  useSendProposal,
  useResendProposal,
} from "../hooks/useProposal";

import type { Proposal } from "../lib/types/proposal";

export default function Proposal() {
  /* -----------------------------
      Queries
  ------------------------------*/

  const {
    data: proposals = [],
    isLoading,
    isError,
  } = useProposals();

  const createProposal = useCreateProposal();
  const sendProposal = useSendProposal();

const resendProposal = useResendProposal();

const [processingId, setProcessingId] =
  useState<number | null>(null);

  const handleSendProposal = (proposalId: number) => {

  setProcessingId(proposalId);

  sendProposal.mutate(proposalId, {

    onSuccess: () => {

      alert("Proposal email sent successfully.");

      setProcessingId(null);

    },

    onError: (error) => {

      console.error(error);

      alert("Unable to send proposal.");

      setProcessingId(null);

    },

  });

};

const handleResendProposal = (proposalId: number) => {

  setProcessingId(proposalId);

  resendProposal.mutate(proposalId, {

    onSuccess: () => {

      alert("Proposal email resent successfully.");

      setProcessingId(null);

    },

    onError: (error) => {

      console.error(error);

      alert("Unable to resend proposal.");

      setProcessingId(null);

    },

  });

};

  /* -----------------------------
      Local State
  ------------------------------*/

  const [search, setSearch] = useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  /* -----------------------------
      Summary Cards
  ------------------------------*/

  const total = proposals.length;

  const draft = proposals.filter(
    (p) => p.status === "DRAFT"
  ).length;

  const emailSent = proposals.filter(
    (p) => p.status === "EMAIL_SENT"
  ).length;

  const opened = proposals.filter(
    (p) => p.status === "OPENED"
  ).length;

  const submitted = proposals.filter(
    (p) => p.status === "SUBMITTED"
  ).length;

  /* -----------------------------
      Search
  ------------------------------*/

  const filtered = useMemo(() => {

    const keyword = search.toLowerCase();

    return proposals.filter((proposal: Proposal) => {

      return (
        proposal.customerName
          .toLowerCase()
          .includes(keyword) ||

        proposal.customerEmail
          .toLowerCase()
          .includes(keyword) ||

        proposal.productName
          .toLowerCase()
          .includes(keyword) ||

        proposal.proposalNumber
          .toLowerCase()
          .includes(keyword)
      );

    });

  }, [search, proposals]);

  /* -----------------------------
      Status Badge
  ------------------------------*/

  const badge = (status: string) => {

    switch (status) {

      case "DRAFT":
        return "bg-slate-100 text-slate-700";

      case "EMAIL_SENT":
        return "bg-blue-100 text-blue-700";

      case "OPENED":
        return "bg-amber-100 text-amber-700";

      case "SUBMITTED":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-slate-100 text-slate-700";

    }

  };

  /* -----------------------------
      Create Proposal
  ------------------------------*/

  const handleCreateProposal = (
    values: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      productName: string;
    }
  ) => {

    createProposal.mutate(values, {

      onSuccess: () => {

        // invalidateQueries() in hook
        // automatically refreshes the table

        setShowCreateModal(false);

      },

      onError: (error) => {

        console.error(error);

        alert("Unable to create proposal.");

      },

    });

  };

  /* -----------------------------
      Loading
  ------------------------------*/

  if (isLoading) {

    return (

      <div className="flex h-80 items-center justify-center">

        <div className="flex flex-col items-center gap-4">

          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />

          <p className="text-slate-500">
            Loading proposals...
          </p>

        </div>

      </div>

    );

  }

  /* -----------------------------
      Error
  ------------------------------*/

  if (isError) {

    return (

      <div className="rounded-xl border border-red-200 bg-red-50 p-8">

        <h2 className="text-lg font-semibold text-red-700">
          Unable to load proposals.
        </h2>

        <p className="mt-2 text-sm text-red-500">
          Please refresh the page.
        </p>

      </div>

    );

  }

  return (
    <div className="space-y-6">

      {/* Summary */}

      <div className="grid gap-4 md:grid-cols-4">
<SummaryCard title="Total Proposals" value={total} />

<SummaryCard title="Draft" value={draft} />

<SummaryCard title="Email Sent" value={emailSent} />

<SummaryCard title="Opened" value={opened} />

<SummaryCard title="Submitted" value={submitted} />
      </div>

      {/* Toolbar */}

      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:flex-row md:items-center md:justify-between">

        <div className="flex-1">

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proposal..."
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-emerald-500"
          />

        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700"
        >
          + Create Proposal
        </button>

      </div>

      {/* Table */}

            {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-slate-100">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Proposal No
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Phone
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Product
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filtered.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="py-12 text-center"
                  >

                    <div className="flex flex-col items-center">

                      <svg
                        className="mb-4 h-14 w-14 text-slate-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6M8 4h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z"
                        />
                      </svg>

                      <h3 className="text-lg font-semibold text-slate-700">
                        No Proposals Found
                      </h3>

                      <p className="mt-2 text-sm text-slate-500">
                        Create your first proposal.
                      </p>

                    </div>

                  </td>

                </tr>

              ) : (

                filtered.map((proposal) => (

                  <tr
                    key={proposal.id}
                    className="border-t hover:bg-slate-50"
                  >

                    <td className="px-6 py-4 font-semibold">
                      {proposal.proposalNumber}
                    </td>

                    <td className="px-6 py-4">

                      <div className="font-medium">
                        {proposal.customerName}
                      </div>

                      <div className="text-sm text-slate-500">
                        {proposal.customerEmail}
                      </div>

                    </td>

                    <td className="px-6 py-4">
                      {proposal.customerPhone}
                    </td>

                    <td className="px-6 py-4">
                      {proposal.productName}
                    </td>

                    <td className="px-6 py-4">

                      <span
  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${badge(
    proposal.status
  )}`}
>
  {proposal.status.replace("_", " ")}
</span>

                    </td>

                    <td className="px-6 py-4">

                      <div className="flex justify-center gap-2">

  <button
    className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium hover:bg-slate-200"
  >
    View
  </button>

  <button
    disabled={
      proposal.status !== "DRAFT" ||
      processingId === proposal.id
    }
    onClick={() => handleSendProposal(proposal.id)}
    className={`rounded-lg px-3 py-2 text-sm font-medium text-white transition

      ${
        proposal.status === "DRAFT"
          ? "bg-emerald-600 hover:bg-emerald-700"
          : "cursor-not-allowed bg-slate-300"
      }
    `}
  >
    {processingId === proposal.id &&
    sendProposal.isPending
      ? "Sending..."
      : "Send"}
  </button>

  <button
    disabled={
      proposal.status === "DRAFT" ||
      proposal.status === "SUBMITTED" ||
      processingId === proposal.id
    }
    onClick={() =>
      handleResendProposal(proposal.id)
    }
    className={`rounded-lg px-3 py-2 text-sm font-medium text-white transition

      ${
        proposal.status === "EMAIL_SENT" ||
        proposal.status === "OPENED"
          ? "bg-blue-600 hover:bg-blue-700"
          : "cursor-not-allowed bg-slate-300"
      }
    `}
  >
    {processingId === proposal.id &&
    resendProposal.isPending
      ? "Resending..."
      : "Resend"}
  </button>

</div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Create Proposal Modal */}

      <CreateProposalModal
        open={showCreateModal}
        loading={createProposal.isPending}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProposal}
      />

    </div>
  );
}

function SummaryCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-800">
        {value}
      </h2>

    </div>
  );
}