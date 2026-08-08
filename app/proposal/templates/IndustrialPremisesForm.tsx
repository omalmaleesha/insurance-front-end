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

export default function IndustrialPremisesForm({
  formData,
  errors,
  isSubmitting,
  onChange,
  onSubmit,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
      {/* Industrial Header */}
      <div className="border-b bg-gradient-to-r from-amber-900 to-slate-900 p-6 text-white sm:p-8">
        <span className="inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-400 ring-1 ring-amber-500/30">
          Industrial & Factory Cover
        </span>
        <h1 className="mt-3 text-2xl font-bold sm:text-3xl">Industrial Premises Proposal</h1>
        <p className="mt-1 text-sm text-amber-100">
          Declaration form for industrial sites, processing facilities, and manufacturing plants.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 p-6 sm:p-8">
        <div>
          <label className="block text-sm font-semibold text-slate-700">Authorized Officer / Applicant Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={onChange}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
          />
          {errors.customerName && <p className="mt-1 text-xs text-rose-500">{errors.customerName}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Contact Telephone</label>
            <input
              type="text"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={onChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
            />
            {errors.customerPhone && <p className="mt-1 text-xs text-rose-500">{errors.customerPhone}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={onChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
            />
            {errors.dateOfBirth && <p className="mt-1 text-xs text-rose-500">{errors.dateOfBirth}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Factory / Industrial Site Address</label>
          <textarea
            name="address"
            rows={3}
            value={formData.address}
            onChange={onChange}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
          />
          {errors.address && <p className="mt-1 text-xs text-rose-500">{errors.address}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700">NIC / Official Identification</label>
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={onChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
            />
            {errors.nic && <p className="mt-1 text-xs text-rose-500">{errors.nic}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">Industry / Manufacturing Sector</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={onChange}
              className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
            />
            {errors.occupation && <p className="mt-1 text-xs text-rose-500">{errors.occupation}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Authorized Signature (Base64 String)</label>
          <textarea
            name="signatureBase64"
            rows={2}
            placeholder="data:image/png;base64,..."
            value={formData.signatureBase64}
            onChange={onChange}
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2 text-xs font-mono focus:border-amber-500 focus:outline-none"
          />
          {errors.signatureBase64 && <p className="mt-1 text-xs text-rose-500">{errors.signatureBase64}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-amber-700 py-3 font-semibold text-white shadow-lg shadow-amber-200 transition hover:bg-amber-800 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting Industrial Proposal..." : "Submit Industrial Proposal"}
        </button>
      </form>
    </div>
  );
}