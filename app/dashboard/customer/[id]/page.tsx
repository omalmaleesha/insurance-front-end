"use client";

import { use } from "react";
import Link from "next/link";
import { useCustomer } from "../hooks/useCustomer";
import {
  type Customer,
  CustomerType,
  Status,
  PersonalCustomerResponse,
} from "../../../lib/types/customer";
import {
  ArrowLeft,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Briefcase,
  Globe,
  UserCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";

function isPersonalCustomer(
  customer: Customer
): customer is PersonalCustomerResponse {
  return "firstName" in customer || customer.customerType === CustomerType.PERSONAL;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CustomerDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const customerId = Number(id);

  const { data: customer, isLoading, isError } = useCustomer(customerId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm font-medium text-slate-500">Loading customer details…</p>
      </div>
    );
  }

  if (isError || !customer) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-50">
          <AlertTriangle className="h-7 w-7 text-rose-500" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-slate-900">Customer not found</h2>
          <p className="mt-1 text-sm text-slate-500">
            The customer you are looking for does not exist or has been removed.
          </p>
        </div>
        <Link
          href="/dashboard/customer"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Customers
        </Link>
      </div>
    );
  }

  const isPersonal = isPersonalCustomer(customer);
  const displayName = isPersonal
    ? `${customer.firstName} ${customer.lastName}`
    : customer.companyName;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* ========== HEADER ========== */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/customer"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {displayName}
              </h1>
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                  isPersonal
                    ? "bg-blue-50 text-blue-700"
                    : "bg-purple-50 text-purple-700"
                }`}
              >
                {isPersonal ? (
                  <>
                    <User className="h-3 w-3" /> Personal
                  </>
                ) : (
                  <>
                    <Building2 className="h-3 w-3" /> Corporate
                  </>
                )}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-slate-500">
              {customer.customerCode}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-semibold ${
            customer.status === Status.ACTIVE
              ? "bg-emerald-100 text-emerald-800"
              : customer.status === Status.SUSPENDED
              ? "bg-amber-100 text-amber-800"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {customer.status}
        </span>
      </div>

      {/* ========== CONTENT ========== */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contact */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={customer.email} />
              <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={customer.phoneNumber} />
              <InfoItem
                icon={<MapPin className="h-4 w-4" />}
                label="Address"
                value={customer.address}
                className="sm:col-span-2"
              />
              <InfoItem icon={<MapPin className="h-4 w-4" />} label="City" value={customer.city} />
              <InfoItem icon={<Globe className="h-4 w-4" />} label="Country" value={customer.country} />
            </div>
          </section>

          {/* Personal */}
          {isPersonal && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Personal Details
              </h2>
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                <InfoItem icon={<CreditCard className="h-4 w-4" />} label="NIC / Identity No" value={customer.nic} />
                <InfoItem icon={<Calendar className="h-4 w-4" />} label="Date of Birth" value={customer.dateOfBirth} />
                <InfoItem icon={<UserCircle className="h-4 w-4" />} label="Gender" value={customer.gender} />
                <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Occupation" value={customer.occupation} />
              </div>
            </section>
          )}

          {/* Corporate */}
          {!isPersonal && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Company Details
              </h2>
              <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
                <InfoItem icon={<Building2 className="h-4 w-4" />} label="Registration Number" value={customer.registrationNumber} />
                <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Industry" value={customer.industry} />
                <InfoItem icon={<User className="h-4 w-4" />} label="Contact Person" value={customer.contactPerson} />
                <InfoItem icon={<UserCircle className="h-4 w-4" />} label="Contact Designation" value={customer.contactDesignation} />
                <InfoItem icon={<Phone className="h-4 w-4" />} label="Contact Phone" value={customer.contactPhone} />
                <InfoItem icon={<Globe className="h-4 w-4" />} label="Website" value={customer.website || "—"} />
              </div>
            </section>
          )}
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Record Information
            </h2>
            <div className="space-y-5">
              <InfoItem label="Customer ID" value={String(customer.id)} />
              <InfoItem label="Customer Code" value={customer.customerCode} />
              <InfoItem label="Created At" value={new Date(customer.createdAt).toLocaleString()} />
              <InfoItem label="Last Updated" value={new Date(customer.updatedAt).toLocaleString()} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Actions
            </h2>
            <Link
              href="/dashboard/customer"
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
  className = "",
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
        {icon && <span className="text-slate-400">{icon}</span>}
        <span>{label}</span>
      </div>
      <p className="mt-1.5 text-sm font-medium leading-snug text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}