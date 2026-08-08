"use client";

import { useMemo, useState } from "react";
import CreateProposalModal from "./components/CreateProposalModal";
import {
  useCreateProposal,
  useProposals,
  useSendProposal,
  useResendProposal,
  useProposal, // <--- Import useProposal
} from "../hooks/useProposal";
import type { Proposal } from "../lib/types/proposal";

export default function ProposalComponent() {
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
  
  // State for View Details Modal
  const [selectedId, setSelectedId] = useState<number | null>(null);

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
        <p className="text-sm font-medium text-slate-500">Loading proposals…</p>
      </div>
    );
  }

  /* -----------------------------
      Error
  ------------------------------*/
  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
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
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryCard title="Total Proposals" value={total} accent="emerald" />
        <SummaryCard title="Draft" value={draft} accent="slate" />
        <SummaryCard title="Email Sent" value={emailSent} accent="blue" />
        <SummaryCard title="Opened" value={opened} accent="amber" />
        <SummaryCard title="Submitted" value={submitted} accent="emerald" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, product or proposal no…"
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 px-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
        />
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700"
        >
          Create Proposal
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase text-slate-500">Proposal No</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase text-slate-500">Customer</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase text-slate-500">Phone</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase text-slate-500">Product</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase text-slate-500">Status</th>
                <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((proposal) => (
                <tr key={proposal.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">{proposal.proposalNumber}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{proposal.customerName}</div>
                    <div className="text-sm text-slate-500">{proposal.customerEmail}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-700">{proposal.customerPhone}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{proposal.productName}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${badge(proposal.status)}`}>
                      {proposal.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {/* FIXED VIEW BUTTON */}
                      <button
                        onClick={() => setSelectedId(proposal.id)}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        View
                      </button>

                      <button
                        disabled={proposal.status !== "DRAFT" || processingId === proposal.id}
                        onClick={() => handleSendProposal(proposal.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white transition ${
                          proposal.status === "DRAFT" ? "bg-emerald-600 hover:bg-emerald-700" : "cursor-not-allowed bg-slate-200 text-slate-400"
                        }`}
                      >
                        {processingId === proposal.id && sendProposal.isPending ? "Sending…" : "Send"}
                      </button>

                      <button
                        disabled={proposal.status === "DRAFT" || proposal.status === "SUBMITTED" || processingId === proposal.id}
                        onClick={() => handleResendProposal(proposal.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white transition ${
                          proposal.status === "EMAIL_SENT" || proposal.status === "OPENED"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "cursor-not-allowed bg-slate-200 text-slate-400"
                        }`}
                      >
                        {processingId === proposal.id && resendProposal.isPending ? "Resending…" : "Resend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal Component */}
      {selectedId && (
        <ProposalViewModal
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}

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

/* ─── Proposal Details Modal ───────────────────────────────────────── */
function ProposalViewModal({ id, onClose }: { id: number; onClose: () => void }) {
  // Uses the useProposal hook with the selected ID
  const { data: proposal, isLoading, isError } = useProposal(id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Proposal Details #{proposal?.proposalNumber || id}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading details...
          </div>
        ) : isError || !proposal ? (
          <div className="py-12 text-center text-sm text-rose-500">
            Failed to load details.
          </div>
        ) : (
          <div className="mt-4 space-y-4 text-sm text-slate-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400">Customer Name</p>
                <p className="font-semibold">{proposal.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="font-semibold">{proposal.customerEmail}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <p className="font-semibold">{proposal.customerPhone}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Product</p>
                <p className="font-semibold">{proposal.productName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Status</p>
                <p className="font-semibold">{proposal.status}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Address</p>
                <p className="font-semibold">{proposal.address || "N/A"}</p>
              </div>
            </div>

            {proposal.signatureBase64 && (
              <div className="border-t pt-3">
                <p className="text-xs text-slate-400 mb-2">Signature</p>
                <img
                  src={proposal.signatureBase64}
                  alt="Customer Signature"
                  className="max-h-24 rounded border p-2"
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Summary Card Component ───────────────────────────────────────── */
function SummaryCard({
  title,
  value,
  accent = "emerald",
}: {
  title: string;
  value: number;
  accent?: "emerald" | "slate" | "blue" | "amber";
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
    </div>
  );
}