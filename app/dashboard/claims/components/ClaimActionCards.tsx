import Link from "next/link";

import {
  ClipboardCheck,
  Upload,
  FileSearch,
  ChevronRight,
} from "lucide-react";

interface ClaimActionCardsProps {
  claimId: number;
}

export function ClaimActionCards({
  claimId,
}: ClaimActionCardsProps) {
  const actions = [
    {
      title: "Claim Report",
      description:
        "Review claim information and incident details.",
      href: `/dashboard/claims/${claimId}/report-check`,
      icon: ClipboardCheck,
    },
    {
      title: "Document Upload",
      description:
        "Upload and manage claim documents.",
      href: `/dashboard/claims/${claimId}/documents`,
      icon: Upload,
    },
    {
      title: "Document Check",
      description:
        "Review uploaded documents and verification status.",
      href: `/dashboard/claims/${claimId}/documents`,
      icon: FileSearch,
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Claim Actions
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Continue processing this insurance claim.
        </p>
      </div>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/40"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-800">
                  {action.title}
                </h3>

                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                  {action.description}
                </p>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}