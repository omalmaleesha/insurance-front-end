"use client";

import React from "react";
import type { ProposalFormRequest } from "../../lib/types/proposal";

interface Props {
  formData: ProposalFormRequest;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function PrivateHouseForm({
  formData,
  errors,
  isSubmitting,
  onChange,
  onSubmit,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      {/* ─── SLIC Document Header ───────────────────────────────────── */}
      <div className="border-b bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-block rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-300 ring-1 ring-emerald-400/30 uppercase">
              Fire Insurance Proposal
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Private Dwelling Houses
            </h1>
            <p className="mt-1 text-xs text-emerald-100 sm:text-sm">
              පුද්ගලික නිවාස සදහා වූ ගිනි රක්ෂණ යෝජනා පත්‍රය
            </p>
          </div>
          <div className="rounded-xl bg-white/10 p-3 text-right text-xs backdrop-blur-sm">
            <p className="font-semibold text-white">Sri Lanka Insurance</p>
            <p className="text-emerald-200">Corporation Ltd</p>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8 p-6 sm:p-8">
        
        {/* ─── Section 1: Customer Details ──────────────────────────── */}
        <div className="space-y-4">
          <h2 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wider text-slate-800">
            1. Applicant Information / යෝජකයාගේ තොරතුරු
          </h2>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              1. Proposer's Name in full (Mr./Mrs./Miss) / සම්පූර්ණ නම
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={onChange}
              placeholder="e.g. Mr. K. A. Perera"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.customerName && <p className="mt-1 text-xs text-rose-500">{errors.customerName}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                2. National Identity Card No / ජාතික හැඳුනුම්පත් අංකය
              </label>
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={onChange}
                placeholder="e.g. 199012345678 or 901234567V"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {errors.nic && <p className="mt-1 text-xs text-rose-500">{errors.nic}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Date of Birth / උපන් දිනය
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={onChange}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {errors.dateOfBirth && <p className="mt-1 text-xs text-rose-500">{errors.dateOfBirth}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Telephone / Contact No / දුරකථන අංකය
              </label>
              <input
                type="text"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={onChange}
                placeholder="e.g. 0771234567"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {errors.customerPhone && <p className="mt-1 text-xs text-rose-500">{errors.customerPhone}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Occupation / රකියාව
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={onChange}
                placeholder="e.g. Engineer / Accountant"
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              {errors.occupation && <p className="mt-1 text-xs text-rose-500">{errors.occupation}</p>}
            </div>
          </div>
        </div>

        {/* ─── Section 2: Property & Premises Details ───────────────── */}
        <div className="space-y-4">
          <h2 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wider text-slate-800">
            2. Property & Location Details / දේපල සහ පිහිටීමේ විස්තර
          </h2>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Full Address of Premises to be Insured / දේපල පිහිටි ස්ථානයේ සම්පූර්ණ ලිපිනය
            </label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={onChange}
              placeholder="Enter complete building & premises location address"
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.address && <p className="mt-1 text-xs text-rose-500">{errors.address}</p>}
          </div>

          {/* SLIC Physical Inspection Details Display */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 space-y-3">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Building Specifications (SLIC Standard Form Standard Questions 11 - 15)
            </p>
            <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-2">
              <div className="rounded-lg bg-white p-2.5 border border-slate-200">
                <strong>Walls:</strong> Brick / Concrete Block
              </div>
              <div className="rounded-lg bg-white p-2.5 border border-slate-200">
                <strong>Roof:</strong> Tiles / Asbestos Sheet
              </div>
              <div className="rounded-lg bg-white p-2.5 border border-slate-200">
                <strong>Floors:</strong> Ground Floor + Upper Floors
              </div>
              <div className="rounded-lg bg-white p-2.5 border border-slate-200">
                <strong>Occupancy:</strong> Solely Private Dwelling House
              </div>
            </div>
          </div>
        </div>

        {/* ─── Section 3: Declaration & Legal Warranty ──────────────── */}
        <div className="space-y-4">
          <h2 className="border-b border-slate-200 pb-2 text-sm font-bold uppercase tracking-wider text-slate-800">
            3. Declaration / ප්‍රකාශනය
          </h2>

          <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 text-xs leading-relaxed text-amber-900">
            <p>
              <strong>Warranty & Agreement:</strong> I/We hereby warrant the truth of the above statements and I/we have withheld no information whatsoever which might tend in any way to increase the risk of the Sri Lanka Insurance Corporation Ltd. or influence the acceptance of this Proposal. I/We further agree that this proposal shall be the basis of the contract between me/us and Sri Lanka Insurance Corporation Ltd.
            </p>
            <p className="mt-2 text-amber-800">
              ඉහත සදහන් ප්‍රකාශයන් සත්‍ය බවත්, ශ්‍රී ලංකා රක්ෂණ සංස්ථාවේ අවදානම වැඩිවන ආකාරයේ හෝ යෝජනාව භාරගැනීමට බලපාන කිසිදු තොරතුරක් සඟවා නොමැති බවත් මම/අපි සහතික වෙමු.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Digital Signature (Base64) / යෝජකයාගේ අත්සන
            </label>
            <textarea
              name="signatureBase64"
              rows={2}
              placeholder="data:image/png;base64,..."
              value={formData.signatureBase64}
              onChange={onChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2 text-xs font-mono focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {errors.signatureBase64 && <p className="mt-1 text-xs text-rose-500">{errors.signatureBase64}</p>}
          </div>
        </div>

        {/* ─── Submit Action ────────────────────────────────────────── */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Submitting SLIC Form...</span>
              </>
            ) : (
              <span>Submit Private Dwelling Proposal</span>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}