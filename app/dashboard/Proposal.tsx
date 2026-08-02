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
  const { data: proposals = [], isLoading, isError } = useProposals();
  const createProposal = useCreateProposal();
  const sendProposal = useSendProposal();
  const resendProposal = useResendProposal();

  const [processingId, setProcessingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  /* -----------------------------
      Handlers
  ------------------------------*/
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

  const handleCreateProposal = (values: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    productName: string;
  }) => {
    createProposal.mutate(values, {
      onSuccess: () => {
        setShowCreateModal(false);
      },
      onError: (error) => {
        console.error(error);
        alert("Unable to create proposal.");
      },
    });
  };

  /* -----------------------------
      Summary
  ------------------------------*/
  const total = proposals.length;
  const draft = proposals.filter((p) => p.status === "DRAFT").length;
  const emailSent = proposals.filter((p) => p.status === "EMAIL_SENT").length;
  const opened = proposals.filter((p) => p.status === "OPENED").length;
  const submitted = proposals.filter((p) => p.status === "SUBMITTED").length;

  /* -----------------------------
      Search
  ------------------------------*/
  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();
    return proposals.filter((proposal: Proposal) => {
      return (
        proposal.customerName.toLowerCase().includes(keyword) ||
        proposal.customerEmail.toLowerCase().includes(keyword) ||
        proposal.productName.toLowerCase().includes(keyword) ||
        proposal.proposalNumber.toLowerCase().includes(keyword)
      );
    });
  }, [search, proposals]);

  /* -----------------------------
      Status Badge
  ------------------------------*/
  const badge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
      case "EMAIL_SENT":
        return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";
      case "OPENED":
        return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
      case "SUBMITTED":
        return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
    }
  };

  /* -----------------------------
      Loading
  ------------------------------*/
  if (isLoading) {
    return (
      <div className="flex h-80 flex-col items-center justify-center gap-4">
        <div className="h-11 w-11 animate-spin rounded-full border-[3px] border-emerald-600 border-t-transparent" />
        <p className="text-sm font-medium text-slate-500">
          Loading proposals…
        </p>
      </div>
    );
  }

  /* -----------------------------
      Error
  ------------------------------*/
  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100">
          <svg
            className="h-6 w-6 text-rose-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-rose-800">
          Unable to load proposals
        </h2>
        <p className="mt-2 text-sm text-rose-600">
          Please refresh the page or try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Summary Cards ─────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryCard
          title="Total Proposals"
          value={total}
          accent="emerald"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />
            </svg>
          }
        />
        <SummaryCard
          title="Draft"
          value={draft}
          accent="slate"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
        />
        <SummaryCard
          title="Email Sent"
          value={emailSent}
          accent="blue"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <SummaryCard
          title="Opened"
          value={opened}
          accent="amber"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        <SummaryCard
          title="Submitted"
          value={submitted}
          accent="emerald"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* ─── Toolbar ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, product or proposal no…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-700 active:scale-[0.98]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Proposal
        </button>
      </div>

      {/* ─── Table ─────────────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Proposal No
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Customer
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Phone
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Product
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                        <svg
                          className="h-7 w-7 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h6m-6 4h6M8 4h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-base font-semibold text-slate-800">
                        No proposals found
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-500">
                        {search
                          ? "Try adjusting your search terms."
                          : "Create your first proposal to get started."}
                      </p>
                      {!search && (
                        <button
                          onClick={() => setShowCreateModal(true)}
                          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          Create Proposal
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((proposal) => (
                  <tr
                    key={proposal.id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="font-semibold text-slate-900">
                        {proposal.proposalNumber}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {proposal.customerName}
                      </div>
                      <div className="mt-0.5 text-sm text-slate-500">
                        {proposal.customerEmail}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">
                      {proposal.customerPhone}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-700">
                      {proposal.productName}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${badge(
                          proposal.status
                        )}`}
                      >
                        {proposal.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50">
                          View
                        </button>

                        <button
                          disabled={
                            proposal.status !== "DRAFT" ||
                            processingId === proposal.id
                          }
                          onClick={() => handleSendProposal(proposal.id)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white transition ${
                            proposal.status === "DRAFT"
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "cursor-not-allowed bg-slate-200 text-slate-400"
                          }`}
                        >
                          {processingId === proposal.id && sendProposal.isPending
                            ? "Sending…"
                            : "Send"}
                        </button>

                        <button
                          disabled={
                            proposal.status === "DRAFT" ||
                            proposal.status === "SUBMITTED" ||
                            processingId === proposal.id
                          }
                          onClick={() => handleResendProposal(proposal.id)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white transition ${
                            proposal.status === "EMAIL_SENT" ||
                            proposal.status === "OPENED"
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "cursor-not-allowed bg-slate-200 text-slate-400"
                          }`}
                        >
                          {processingId === proposal.id &&
                          resendProposal.isPending
                            ? "Resending…"
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

      {/* Create Modal */}
      <CreateProposalModal
        open={showCreateModal}
        loading={createProposal.isPending}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProposal}
      />
    </div>
  );
}

/* ─── Summary Card ─────────────────────────────────────────────────── */
function SummaryCard({
  title,
  value,
  accent = "emerald",
  icon,
}: {
  title: string;
  value: number;
  accent?: "emerald" | "slate" | "blue" | "amber";
  icon: React.ReactNode;
}) {
  const accentStyles = {
    emerald: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-100 text-slate-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${accentStyles[accent]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}