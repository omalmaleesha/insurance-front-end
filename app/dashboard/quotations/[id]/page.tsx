"use client";

import { use } from "react";
import Link from "next/link";
import { useQuotation } from "../hooks/useQuotation"; // adjust path if needed
import {
  ArrowLeft,
  User,
  FileText,
  Package,
  DollarSign,
  Loader2,
  AlertTriangle,
  Building2,
  Home,
  Factory,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QuotationDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const quotationId = Number(id);

  const { data: quotation, isLoading, isError } = useQuotation(quotationId);

  // ======================
  // Loading
  // ======================
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm font-medium text-slate-500">Loading quotation details…</p>
      </div>
    );
  }

  // ======================
  // Error
  // ======================
  if (isError || !quotation) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
          <AlertTriangle className="h-7 w-7 text-rose-500" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">Quotation not found</h2>
          <p className="mt-1 text-sm text-slate-500">
            The quotation you are looking for does not exist or has been removed.
          </p>
        </div>
        <Link
          href="/dashboard/quotations"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quotations
        </Link>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    DRAFT: "bg-amber-50 text-amber-700",
    APPROVED: "bg-emerald-50 text-emerald-700",
    ISSUED: "bg-blue-50 text-blue-700",
    REJECTED: "bg-rose-50 text-rose-700",
  };

  const typeIcon = {
    PRIVATE_HOUSE: <Home className="h-4 w-4" />,
    BUSINESS_PREMISES: <Building2 className="h-4 w-4" />,
    INDUSTRIAL_PREMISES: <Factory className="h-4 w-4" />,
  }[quotation.quotationType] || <Package className="h-4 w-4" />;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/quotations"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {quotation.quotationReference}
              </h1>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  statusColor[quotation.status] || "bg-slate-100 text-slate-700"
                }`}
              >
                {quotation.status}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-slate-500">
              {quotation.quotationType?.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs font-medium text-slate-400">Grand Total Premium</p>
          <p className="text-2xl font-bold text-emerald-600">
            {quotation.grandTotalPremium ?? "—"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quotation Information
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <InfoItem
                icon={<FileText className="h-4 w-4" />}
                label="Reference"
                value={quotation.quotationReference}
              />
              <InfoItem
                icon={<User className="h-4 w-4" />}
                label="Customer Name"
                value={quotation.customerName}
              />
              <InfoItem
                icon={typeIcon}
                label="Quotation Type"
                value={quotation.quotationType?.replace(/_/g, " ") || "—"}
              />
              <InfoItem
                icon={<DollarSign className="h-4 w-4" />}
                label="Currency"
                value={(quotation as any).currency || "LKR"}
              />
              <InfoItem
                label="Status"
                value={quotation.status}
              />
              <InfoItem
                label="Grand Total Premium"
                value={String(quotation.grandTotalPremium ?? "—")}
              />
            </div>
          </section>

          {/* Full Details (raw for now – you can expand later) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Full Quotation Data
            </h2>
            <div className="max-h-96 overflow-auto rounded-xl border border-slate-100 bg-slate-50 p-4">
              <pre className="whitespace-pre-wrap text-xs text-slate-700">
                {JSON.stringify(quotation, null, 2)}
              </pre>
            </div>
          </section>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Record Information
            </h2>
            <div className="space-y-5">
              <InfoItem label="Quotation ID" value={String(quotation.id)} />
              <InfoItem label="Reference" value={quotation.quotationReference} />
              <InfoItem label="Status" value={quotation.status} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Actions
            </h2>
            <Link
              href="/dashboard/quotations"
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