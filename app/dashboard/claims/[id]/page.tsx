"use client";

import { use } from "react";
import Link from "next/link";
import { useClaim } from "../hooks/useClaim";
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
  RotateCcw,
} from "lucide-react";
import { ClaimActionCards } from "../components/ClaimActionCards";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ClaimDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const claimId = Number(id);
  
  // Extracting refetch alongside query data
  const { data: claim, isLoading, isError, refetch } = useClaim(claimId);

  const handleReload = () => {
    if (refetch) {
      refetch();
    } else {
      window.location.reload();
    }
  };

  // Loading State - Low eye strain dark background
  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 bg-[#0b1329] text-slate-100 rounded-2xl border border-slate-800/80 p-8 shadow-2xl">
        <Loader2 className="h-9 w-9 animate-spin text-blue-400" />
        <p className="text-sm font-medium text-slate-400">Loading claim records...</p>
      </div>
    );
  }

  // Error / Not Found State with Actionable Reload
  if (isError || !claim) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-[#0b1329] text-slate-100 rounded-2xl border border-slate-800/80 p-8 shadow-2xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <AlertTriangle className="h-8 w-8 text-rose-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-100">Failed to load claim</h2>
          <p className="mt-1 text-sm text-slate-400">
            We couldnnot retrieve the claim details. This might be a network glitch or missing record.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={handleReload}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            Reload Data
          </button>
          <Link
            href="/dashboard/claims"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Claims
          </Link>
        </div>
      </div>
    );
  }

  // Status indicators tuned for dark background contrast
  const statusColor: Record<string, string> = {
    REPORTED: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    UNDER_REVIEW: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    REJECTED: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    CLOSED: "bg-slate-800 text-slate-400 border-slate-700",
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 rounded-3xl bg-[#070d19] p-6 text-slate-100 min-h-screen">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/claims"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900/80 text-slate-300 shadow-sm transition hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-slate-100">
                {claim.claimNumber}
              </h1>
              <span
                className={`inline-flex rounded-full border px-3 py-0.5 text-xs font-medium tracking-wide ${
                  statusColor[claim.status] || "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                {claim.status.replace("_", " ")}
              </span>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-400">{claim.claimType} Claim</p>
          </div>
        </div>

        <button
          onClick={handleReload}
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-slate-700/80 bg-slate-900/60 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
          title="Refresh claim data"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left / Main Section */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-slate-800/80 bg-[#0b1329]/90 p-6 shadow-xl backdrop-blur-sm">
            <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-blue-400">
              Incident Details
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <InfoItem
                icon={<Calendar className="h-4 w-4 text-blue-400" />}
                label="Incident Date"
                value={new Date(claim.incidentDate).toLocaleString()}
              />
              <InfoItem
                icon={<MapPin className="h-4 w-4 text-blue-400" />}
                label="Location"
                value={claim.incidentLocation}
              />
              <InfoItem
                icon={<FileText className="h-4 w-4 text-blue-400" />}
                label="Claim Type"
                value={claim.claimType}
              />
              <InfoItem
                icon={<Building2 className="h-4 w-4 text-blue-400" />}
                label="Branch"
                value={claim.branchCode}
              />
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

        {/* Right Sidebar Section */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-800/80 bg-[#0b1329]/90 p-6 shadow-xl backdrop-blur-sm">
            <h2 className="mb-5 text-xs font-bold uppercase tracking-wider text-blue-400">
              Record Info
            </h2>
            <div className="space-y-5">
              <InfoItem
                icon={<Hash className="h-4 w-4 text-blue-400" />}
                label="Claim ID"
                value={String(claim.id)}
              />
              <InfoItem
                icon={<User className="h-4 w-4 text-blue-400" />}
                label="Customer ID"
                value={String(claim.customerId)}
              />
              <InfoItem label="Created By (ETF)" value={claim.createdByEtfNo} />
              <InfoItem label="Reported Date" value={new Date(claim.reportedDate).toLocaleString()} />
              <InfoItem label="Created At" value={new Date(claim.createdAt).toLocaleString()} />
              <InfoItem label="Updated At" value={new Date(claim.updatedAt).toLocaleString()} />
            </div>
          </section>

          <ClaimActionCards claimId={claim.id} />

          <section className="rounded-2xl border border-slate-800/80 bg-[#0b1329]/90 p-4 shadow-xl">
            <Link
              href="/dashboard/claims"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
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
      <p className="mt-1 text-sm font-medium leading-relaxed text-slate-200">
        {value || "—"}
      </p>
    </div>
  );
}
// four missing features that need to implemet

// Date Range Filters: Claims are highly time-dependent. A date picker to filter
// by "Today," "This Week," or custom ranges is crucial but entirely absent.

// Pagination Controls: The table has no pagination (page numbers) or infinite scroll
// indicators. How does the user navigate when there are 500 claims?

// Export Functionality: Operations teams inevitably need to pull data into Excel for reporting
// An "Export to CSV" button is a mandatory feature for this kind of dashboard.

//add a refresh button to the claim details page to allow users to refresh the
// claim data without navigating away. This is especially useful if the claim status
// or details are updated frequently.