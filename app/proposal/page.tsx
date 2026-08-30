"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
// 1. IMPORT useSubmitProposal HERE
import { usePublicProposal, useSubmitProposal } from "../hooks/usePublicProposal";
import type { ProposalFormRequest } from "../lib/types/proposal";
import type { QuotationType } from "../lib/types/quatation";

import PrivateHouseForm from "./templates/PrivateHouseForm";
import BusinessPremisesForm from "./templates/BusinessPremisesForm";
import IndustrialPremisesForm from "./templates/IndustrialPremisesForm";

export default function ProposalPage() {
  const params = useSearchParams();
  const token = params.get("token") || "";

  const { data, isLoading, isError } = usePublicProposal(token || undefined);
  
  // 2. INITIALIZE THE MUTATION HOOK
  const submitProposal = useSubmitProposal();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Form State strictly adhering to ProposalFormRequest
  const [formData, setFormData] = useState<ProposalFormRequest>({
    token: token,
    customerName: "",
    customerPhone: "",
    address: "",
    dateOfBirth: "",
    nic: "",
    occupation: "",
    signatureBase64: "",
  });

  // Sync token and pre-populated API data
  useEffect(() => {
    if (token) {
      setFormData((prev) => ({ ...prev, token }));
    }
    if (data) {
      setFormData((prev) => ({
        ...prev,
        customerName: data.customerName || prev.customerName,
        customerPhone: data.customerPhone || prev.customerPhone,
      }));
    }
  }, [token, data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.customerName.trim()) errs.customerName = "Full Name is required";
    if (!formData.customerPhone.trim()) errs.customerPhone = "Phone Number is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    if (!formData.dateOfBirth) errs.dateOfBirth = "Date of Birth is required";
    if (!formData.nic.trim()) errs.nic = "NIC or Passport number is required";
    if (!formData.occupation.trim()) errs.occupation = "Occupation / Role is required";
    if (!formData.signatureBase64.trim()) errs.signatureBase64 = "Signature is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 3. EXECUTE THE MUTATION INSIDE SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    try {
      // Execute the API call using React Query Mutation
      await submitProposal.mutateAsync(formData);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Submission failed:", err);
      setApiError(err?.response?.data?.message || err?.message || "Failed to submit proposal. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-6 shadow-lg">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          <p className="text-sm font-medium text-slate-700">Loading proposal details…</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <h2 className="text-xl font-bold text-slate-900">Link Invalid or Expired</h2>
          <p className="mt-2 text-sm text-slate-500">Please request a new proposal link from your agent.</p>
          <Link href="/" className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            ✓
          </div>
          <h2 className="text-xl font-bold text-slate-900">Proposal Submitted Successfully</h2>
          <p className="mt-2 text-sm text-slate-500">
            Thank you for completing the declaration form. We will review your application shortly.
          </p>
        </div>
      </div>
    );
  }

  const templateType: QuotationType = (data.productName || "PRIVATE_HOUSE") as QuotationType;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        
        {/* Render error banner if submission fails */}
        {apiError && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {apiError}
          </div>
        )}

        {templateType === "BUSINESS_PREMISES" && (
          <BusinessPremisesForm
            formData={formData}
            errors={errors}
            isSubmitting={submitProposal.isPending}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        )}

        {templateType === "INDUSTRIAL_PREMISES" && (
          <IndustrialPremisesForm
            formData={formData}
            errors={errors}
            isSubmitting={submitProposal.isPending}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        )}

        {templateType !== "BUSINESS_PREMISES" && templateType !== "INDUSTRIAL_PREMISES" && (
          <PrivateHouseForm
            formData={formData}
            errors={errors}
            isSubmitting={submitProposal.isPending}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}