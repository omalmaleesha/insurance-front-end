"use client";

import { useEffect, useState } from "react";

export interface CreateProposalForm {
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

const initialForm: CreateProposalForm = {
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
  const [form, setForm] =
    useState<CreateProposalForm>(initialForm);

  const [errors, setErrors] = useState<
    Partial<CreateProposalForm>
  >({});

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setErrors({});
    }
  }, [open]);

  if (!open) return null;

  const validate = () => {
    const newErrors: Partial<CreateProposalForm> = {};

    if (!form.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (!form.customerEmail.trim()) {
      newErrors.customerEmail = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail)
    ) {
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
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

            <h2 className="text-xl font-bold">
              Create Proposal
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Fill customer information.
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

        <form
          onSubmit={submit}
          className="space-y-5 p-6"
        >

          {/* Customer */}

          <div>

            <label className="mb-2 block font-medium">
              Customer Name
            </label>

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

            <label className="mb-2 block font-medium">
              Customer Email
            </label>

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

            <label className="mb-2 block font-medium">
              Customer Phone
            </label>

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

          {/* Product */}

          <div>

            <label className="mb-2 block font-medium">
              Product
            </label>

            <select
              disabled={loading}
              name="productName"
              value={form.productName}
              onChange={change}
              className="w-full rounded-xl border px-4 py-3 disabled:bg-slate-100"
            >
              <option value="">
                Select Product
              </option>

              <option value="Motor Insurance">
                Motor Insurance
              </option>

              <option value="Life Insurance">
                Life Insurance
              </option>

              <option value="Medical Insurance">
                Medical Insurance
              </option>

              <option value="Travel Insurance">
                Travel Insurance
              </option>

              <option value="Home Insurance">
                Home Insurance
              </option>

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

              {loading
                ? "Creating..."
                : "Create Proposal"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}