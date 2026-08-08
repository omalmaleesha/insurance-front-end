"use client";

import { useEffect, useState } from "react";
import { useQuotation } from "../../quotations/hooks/useQuotation"; // Update path if needed

export interface CreateProposalForm {
  quotationId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
}

interface Props {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProposalForm) => void;
}

const DEFAULT_PRODUCTS = [
  "Motor Insurance",
  "Life Insurance",
  "Medical Insurance",
  "Travel Insurance",
  "Home Insurance",
];

const initialForm: CreateProposalForm = {
  quotationId: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  productName: "",
};

export default function CreateProposalModal({
  open,
  loading = false,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<CreateProposalForm>(initialForm);
  const [quotationInput, setQuotationInput] = useState<string>("");
  const [quotationIdToFetch, setQuotationIdToFetch] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<CreateProposalForm>>({});
  const [productOptions, setProductOptions] = useState<string[]>(DEFAULT_PRODUCTS);

  // Query hook to fetch quotation data
  const {
    data: quotationData,
    isLoading: isFetchingQuotation,
    isError: isQuotationError,
  } = useQuotation(quotationIdToFetch ?? 0);

  // Auto-populate customerName and productName when quotation data is fetched
  useEffect(() => {
    if (quotationData) {
      const fetchedProduct = quotationData.quotationType || "";

      // Ensure the fetched product is available inside the select options list
      if (fetchedProduct && !productOptions.includes(fetchedProduct)) {
        setProductOptions((prev) => [...prev, fetchedProduct]);
      }

      setForm((prev) => ({
        ...prev,
        quotationId: quotationInput,
        customerName: quotationData.customerName || prev.customerName,
        productName: fetchedProduct || prev.productName,
      }));

      // Clear validation errors for auto-filled fields
      setErrors((prev) => ({
        ...prev,
        customerName: "",
        productName: "",
      }));
    }
  }, [quotationData]);

  // Reset form state when modal opens/closes
  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setQuotationInput("");
      setQuotationIdToFetch(null);
      setProductOptions(DEFAULT_PRODUCTS);
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  const handleFetchQuotation = () => {
    const idNum = Number(quotationInput);
    if (!quotationInput.trim() || isNaN(idNum)) return;
    setQuotationIdToFetch(idNum);
  };

  const validate = () => {
    const newErrors: Partial<CreateProposalForm> = {};

    if (!form.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (!form.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)) {
      newErrors.customerEmail = "Invalid email";
    }

    if (!form.customerPhone.trim()) {
      newErrors.customerPhone = "Phone number is required";
    }

    if (!form.productName) {
      newErrors.productName = "Please select a product";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit(form);
  };

  const change = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (errors[e.target.name as keyof CreateProposalForm]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-xl font-bold">Create Proposal</h2>
            <p className="mt-1 text-sm text-slate-500">
              Fetch via Quotation ID or fill customer information manually.
            </p>
          </div>

          <button
            disabled={loading}
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5 p-6">
          {/* Quotation ID Lookup */}
          <div>
            <label className="mb-2 block font-medium">Quotation ID</label>
            <div className="flex gap-2">
              <input
                type="number"
                disabled={loading || isFetchingQuotation}
                placeholder="Enter Quotation ID"
                value={quotationInput}
                onChange={(e) => setQuotationInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleFetchQuotation();
                  }
                }}
                className="w-full rounded-xl border px-4 py-3 disabled:bg-slate-100"
              />
              <button
                type="button"
                disabled={
                  loading || isFetchingQuotation || !quotationInput.trim()
                }
                onClick={handleFetchQuotation}
                className="flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
              >
                {isFetchingQuotation ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  "Fetch"
                )}
              </button>
            </div>
            {isQuotationError && (
              <p className="mt-1 text-sm text-red-600">
                Failed to fetch quotation details. Please check the ID.
              </p>
            )}
          </div>

          {/* Customer Name */}
          <div>
            <label className="mb-2 block font-medium">Customer Name</label>
            <input
              disabled={loading}
              name="customerName"
              value={form.customerName}
              onChange={change}
              className="w-full rounded-xl border px-4 py-3 disabled:bg-slate-100"
            />
            {errors.customerName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customerName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block font-medium">Customer Email</label>
            <input
              disabled={loading}
              type="email"
              name="customerEmail"
              value={form.customerEmail}
              onChange={change}
              className="w-full rounded-xl border px-4 py-3 disabled:bg-slate-100"
            />
            {errors.customerEmail && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customerEmail}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block font-medium">Customer Phone</label>
            <input
              disabled={loading}
              name="customerPhone"
              value={form.customerPhone}
              onChange={change}
              className="w-full rounded-xl border px-4 py-3 disabled:bg-slate-100"
            />
            {errors.customerPhone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customerPhone}
              </p>
            )}
          </div>

          {/* Product Select */}
          <div>
            <label className="mb-2 block font-medium">Product</label>
            <select
              disabled={loading}
              name="productName"
              value={form.productName}
              onChange={change}
              className="w-full rounded-xl border px-4 py-3 disabled:bg-slate-100"
            >
              <option value="">Select Product</option>
              {productOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.productName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.productName}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t pt-5">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="rounded-xl border px-5 py-2.5 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white disabled:bg-emerald-300"
            >
              {loading && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {loading ? "Creating..." : "Create Proposal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}