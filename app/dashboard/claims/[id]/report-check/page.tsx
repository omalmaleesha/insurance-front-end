"use client";

import { use } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  FileText,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  XCircle,
  RefreshCw,
  User,
  CalendarDays,
  Lock,
  Hash,
  AlertCircle,
} from "lucide-react";

import { useGReport } from "../../hooks/useClaimDocument";

import { GReportJobStatus } from "../../../../lib/types/claim";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function GReportPage({ params }: PageProps) {
  const { id } = use(params);

  const claimId = Number(id);

  const {
    data: gReport,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGReport(claimId);

  const statusStyle: Record<GReportJobStatus, string> = {
    PENDING:
      "bg-amber-500/10 text-amber-400 border border-amber-500/20",

    PROCESSING:
      "bg-blue-500/10 text-blue-400 border border-blue-500/20",

    COMPLETED:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",

    MANUAL_REVIEW:
      "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  };

  const getStatusIcon = (status: GReportJobStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock3 className="h-4 w-4" />;

      case "PROCESSING":
        return <Loader2 className="h-4 w-4 animate-spin" />;

      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4" />;

      case "MANUAL_REVIEW":
        return <AlertTriangle className="h-4 w-4" />;

      default:
        return null;
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "—";

    return new Date(date).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <AlertTriangle className="h-8 w-8 text-rose-400" />

        <p className="text-slate-400">
          Failed to load G-report details.
        </p>

        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0b1329] px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (!gReport) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <FileText className="h-10 w-10 text-slate-600" />

        <p className="text-sm text-slate-400">
          No G-report has been generated for this claim yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/claims/${claimId}`}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-[#0b1329] text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            G Report
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            G-report generation status and processing details.
          </p>
        </div>
      </div>

      {/* Main Status Card */}
      <section className="rounded-2xl border border-slate-800/80 bg-[#0b1329] p-6 shadow-xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-[#070d19]">
              <FileText className="h-6 w-6 text-emerald-400" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                G Report Generation
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Job #{gReport.id} · Claim #{gReport.claimId}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
              statusStyle[gReport.status]
            }`}
          >
            {getStatusIcon(gReport.status)}
            {gReport.status.replaceAll("_", " ")}
          </span>
        </div>
      </section>

      {/* Details */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Job Information */}
        <section className="rounded-2xl border border-slate-800/80 bg-[#0b1329] shadow-xl">

          <div className="border-b border-slate-800/80 px-6 py-5">
            <h2 className="text-sm font-semibold text-slate-100">
              Job Information
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Generation job details.
            </p>
          </div>

          <div className="divide-y divide-slate-800/60">

            <DetailRow
              icon={<Hash className="h-4 w-4" />}
              label="Job ID"
              value={String(gReport.id)}
            />

            <DetailRow
              icon={<FileText className="h-4 w-4" />}
              label="Claim ID"
              value={String(gReport.claimId)}
            />

            <DetailRow
              icon={<RefreshCw className="h-4 w-4" />}
              label="Attempt Count"
              value={String(gReport.attemptCount)}
            />

            <DetailRow
              icon={<User className="h-4 w-4" />}
              label="Worker ID"
              value={gReport.workerId || "Not assigned"}
            />

          </div>
        </section>

        {/* Processing Timeline */}
        <section className="rounded-2xl border border-slate-800/80 bg-[#0b1329] shadow-xl">

          <div className="border-b border-slate-800/80 px-6 py-5">
            <h2 className="text-sm font-semibold text-slate-100">
              Processing Timeline
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              G-report generation timestamps.
            </p>
          </div>

          <div className="divide-y divide-slate-800/60">

            <DetailRow
              icon={<CalendarDays className="h-4 w-4" />}
              label="Created At"
              value={formatDate(gReport.createdAt)}
            />

            <DetailRow
              icon={<Clock3 className="h-4 w-4" />}
              label="Started At"
              value={formatDate(gReport.startedAt)}
            />

            <DetailRow
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Completed At"
              value={formatDate(gReport.completedAt)}
            />

            <DetailRow
              icon={<Lock className="h-4 w-4" />}
              label="Locked At"
              value={formatDate(gReport.lockedAt)}
            />

          </div>
        </section>
      </div>

      {/* Error Information */}
      {(gReport.errorMessage || gReport.lastError) && (
        <section className="rounded-2xl border border-rose-500/20 bg-[#0b1329] shadow-xl">

          <div className="border-b border-rose-500/10 px-6 py-5">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-rose-400" />

              <div>
                <h2 className="text-sm font-semibold text-slate-100">
                  Processing Issues
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Information about errors encountered during generation.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 p-6">

            {gReport.errorMessage && (
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-400">
                  Error Message
                </p>

                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                  <p className="text-sm leading-6 text-rose-300">
                    {gReport.errorMessage}
                  </p>
                </div>
              </div>
            )}

            {gReport.lastError && (
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-400">
                  Last Error
                </p>

                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                  <p className="text-sm leading-6 text-rose-300">
                    {gReport.lastError}
                  </p>
                </div>
              </div>
            )}

          </div>
        </section>
      )}

      {/* Refresh */}
      <div className="flex justify-end">
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0b1329] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isFetching ? "animate-spin" : ""
            }`}
          />

          {isFetching ? "Refreshing..." : "Refresh Status"}
        </button>
      </div>

    </div>
  );
}


/* =========================================
   Detail Row
========================================= */

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">

      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-[#070d19] text-slate-500">
          {icon}
        </div>

        <span className="text-xs font-semibold text-slate-400">
          {label}
        </span>
      </div>

      <span className="max-w-[60%] truncate text-right text-sm text-slate-200">
        {value}
      </span>

    </div>
  );
}