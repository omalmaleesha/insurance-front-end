"use client";

import { use } from "react";
import Link from "next/link";
import { useProposal } from "../../../hooks/useProposal";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Package,
  MapPin,
  FileText,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProposalDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const proposalId = Number(id);

  const { data: proposal, isLoading, isError } = useProposal(proposalId);

  // ======================
  // Loading
  // ======================
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm font-medium text-slate-500">Loading proposal details…</p>
      </div>
    );
  }

  // ======================
  // Error
  // ======================
  if (isError || !proposal) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
          <AlertTriangle className="h-7 w-7 text-rose-500" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">Proposal not found</h2>
          <p className="mt-1 text-sm text-slate-500">
            The proposal you are looking for does not exist or has been removed.
          </p>
        </div>
        <Link
          href="/dashboard/proposals"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Proposals
        </Link>
      </div>
    );
  }

  const statusColor = {
    DRAFT: "bg-slate-100 text-slate-700",
    EMAIL_SENT: "bg-blue-50 text-blue-700",
    OPENED: "bg-amber-50 text-amber-700",
    SUBMITTED: "bg-emerald-50 text-emerald-700",
  }[proposal.status] || "bg-slate-100 text-slate-700";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/proposals"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {proposal.proposalNumber}
              </h1>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor}`}>
                {proposal.status.replace("_", " ")}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-slate-500">{proposal.productName}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 lg:col-span-2">
          {/* Customer Info */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Customer Information
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <InfoItem icon={<User className="h-4 w-4" />} label="Customer Name" value={proposal.customerName} />
              <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={proposal.customerEmail} />
              <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={proposal.customerPhone} />
              <InfoItem icon={<MapPin className="h-4 w-4" />} label="Address" value={proposal.address || "—"} />
            </div>
          </section>

          {/* Product & Extra */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Proposal Details
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <InfoItem icon={<Package className="h-4 w-4" />} label="Product" value={proposal.productName} />
              <InfoItem icon={<FileText className="h-4 w-4" />} label="Proposal Number" value={proposal.proposalNumber} />
              <InfoItem label="Status" value={proposal.status.replace("_", " ")} />
            </div>
          </section>

          {/* Signature */}
          {proposal.signatureBase64 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Customer Signature
              </h2>
              <div className="inline-block rounded-xl border border-slate-200 bg-slate-50 p-4">
                <img
                  src={proposal.signatureBase64}
                  alt="Customer Signature"
                  className="max-h-32 object-contain"
                />
              </div>
            </section>
          )}
        </div>

        {/* Right */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Record Information
            </h2>
            <div className="space-y-5">
              <InfoItem label="Proposal ID" value={String(proposal.id)} />
              <InfoItem label="Proposal Number" value={proposal.proposalNumber} />
              <InfoItem label="Status" value={proposal.status.replace("_", " ")} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Actions
            </h2>
            <Link
              href="/dashboard/proposals"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </div>
      <p className="mt-1.5 text-sm font-medium leading-snug text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}