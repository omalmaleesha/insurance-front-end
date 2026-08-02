// "use client";

// import { useSearchParams } from "next/navigation";

// import { usePublicProposal } from "../hooks/usePublicProposal";

// export default function ProposalPage() {

//   const params = useSearchParams();

//   const token = params.get("token");

//   const {

//     data,

//     isLoading,

//     isError,

//   } = usePublicProposal(token ?? undefined);

//   if (isLoading)
//     return <div>Loading...</div>;

//   if (isError)
//     return <div>Invalid or expired link.</div>;

//   return (

//     <div>

//       <h1>{data?.customerName}</h1>

//       <p>{data?.customerEmail}</p>

//       <p>{data?.proposalNumber}</p>

//     </div>

//   );

// }




"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { usePublicProposal } from "../hooks/usePublicProposal";

export default function ProposalPage() {
  const params = useSearchParams();
  const token = params.get("token");

  const { data, isLoading, isError } = usePublicProposal(token ?? undefined);

  // ─── Loading State ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-50">
        {/* Background mesh */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-teal-200/30 blur-3xl" />
        </div>

        <div className="relative flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/80 p-10 shadow-xl shadow-slate-200/50 backdrop-blur-sm text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
              <svg
                className="h-7 w-7 animate-spin text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">
              Loading proposal
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Please wait while we retrieve your document…
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-50">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-orange-200/20 blur-3xl" />
        </div>

        <div className="relative flex min-h-screen items-center justify-center p-6">
          <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-10 shadow-xl shadow-slate-200/50 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50">
              <svg
                className="h-7 w-7 text-rose-500"
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
            <h2 className="text-xl font-bold text-slate-900">
              Link invalid or expired
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              This proposal link is no longer valid. It may have expired or the
              token is incorrect. Please contact your agent for a new link.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Go to homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Success State ────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-800">
      {/* Background mesh */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-teal-200/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header / Brand */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-200">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">SecureCover</p>
              <p className="text-xs text-slate-500">Insurance Proposal</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Secure document
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

          <div className="p-6 sm:p-8 lg:p-10">
            {/* Proposal badge + number */}
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Proposal
                </span>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {data.proposalNumber || "Proposal Details"}
                </h1>
              </div>

              {/* Optional status pill – adjust based on your data */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-right">
                <p className="text-xs text-slate-500">Status</p>
                <p className="text-sm font-semibold text-emerald-600">
                  Active
                </p>
              </div>
            </div>

            {/* Customer Info Section */}
            <div className="mb-8 rounded-xl border border-slate-100 bg-slate-50/70 p-5 sm:p-6">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Customer Information
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                    <svg
                      className="h-4.5 w-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Full Name</p>
                    <p className="mt-0.5 font-semibold text-slate-900">
                      {data.customerName || "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                    <svg
                      className="h-4.5 w-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Email Address</p>
                    <p className="mt-0.5 font-semibold text-slate-900 break-all">
                      {data.customerEmail || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional fields placeholder – expand with real data */}
            {/* Example structure if you have more fields later */}
            {/* 
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Coverage Summary</h3>
                ...
              </div>
            </div>
            */}

            {/* Footer note */}
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-sm text-emerald-800">
              <svg
                className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>
                This is a secure, time-limited proposal link. Please review the
                details carefully. For any questions, contact your insurance
                advisor.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-xs text-slate-400 sm:text-left">
            © {new Date().getFullYear()} SecureCover Insurance · Confidential
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}