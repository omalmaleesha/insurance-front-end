"use client";

import { use } from "react";
import Link from "next/link";
import { useClaim } from "../hooks/useClaim";
import { ClaimStatus } from "../../../lib/types/claim";
import {
  ArrowLeft,
  User,
  MapPin,
  Calendar,
  FileText,
  Building2,
  Loader2,
  AlertTriangle,
  Hash,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ClaimDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const claimId = Number(id);
  const { data: claim, isLoading, isError } = useClaim(claimId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm font-medium text-slate-500">Loading claim details…</p>
      </div>
    );
  }

  if (isError || !claim) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
          <AlertTriangle className="h-7 w-7 text-rose-500" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">Claim not found</h2>
          <p className="mt-1 text-sm text-slate-500">
            This claim does not exist or was removed.
          </p>
        </div>
        <Link
          href="/dashboard/claims"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Claims
        </Link>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    REPORTED: "bg-amber-50 text-amber-700",
    UNDER_REVIEW: "bg-blue-50 text-blue-700",
    APPROVED: "bg-emerald-50 text-emerald-700",
    REJECTED: "bg-rose-50 text-rose-700",
    CLOSED: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/claims"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {claim.claimNumber}
              </h1>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  statusColor[claim.status] || "bg-slate-100 text-slate-600"
                }`}
              >
                {claim.status.replace("_", " ")}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-slate-500">{claim.claimType} claim</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Incident Details
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <InfoItem icon={<Calendar className="h-4 w-4" />} label="Incident Date" value={new Date(claim.incidentDate).toLocaleString()} />
              <InfoItem icon={<MapPin className="h-4 w-4" />} label="Location" value={claim.incidentLocation} />
              <InfoItem icon={<FileText className="h-4 w-4" />} label="Claim Type" value={claim.claimType} />
              <InfoItem icon={<Building2 className="h-4 w-4" />} label="Branch" value={claim.branchCode} />
              <div className="sm:col-span-2">
                <InfoItem label="Incident Description" value={claim.incidentDescription} />
              </div>
              {claim.situationStatement && (
                <div className="sm:col-span-2">
                  <InfoItem label="Situation Statement" value={claim.situationStatement} />
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Record Info
            </h2>
            <div className="space-y-5">
              <InfoItem icon={<Hash className="h-4 w-4" />} label="Claim ID" value={String(claim.id)} />
              <InfoItem icon={<User className="h-4 w-4" />} label="Customer ID" value={String(claim.customerId)} />
              <InfoItem label="Created By (ETF)" value={claim.createdByEtfNo} />
              <InfoItem label="Reported Date" value={new Date(claim.reportedDate).toLocaleString()} />
              <InfoItem label="Created At" value={new Date(claim.createdAt).toLocaleString()} />
              <InfoItem label="Updated At" value={new Date(claim.updatedAt).toLocaleString()} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <Link
              href="/dashboard/claims"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
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
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1.5 text-sm font-medium leading-snug text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}