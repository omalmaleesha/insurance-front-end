"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  useCustomers,
  useCreatePersonalCustomer,
  useCreateCorporateCustomer,
  useUpdatePersonalCustomer,
  useUpdateCorporateCustomer,
  useDeleteCustomer,
  useSearchCustomers,
} from "./hooks/useCustomer";
import {
  type Customer,
  CustomerType,
  Gender,
  PersonalCustomerResponse,
  CorporateCustomerResponse,
  PersonalCustomerCreateRequest,
  CorporateCustomerCreateRequest,
  PersonalCustomerUpdateRequest,
  CorporateCustomerUpdateRequest,
  Status,
} from "../../lib/types/customer";
import {
  Search,
  Plus,
  Building2,
  User,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  Eye,
} from "lucide-react";

// Type guard
function isPersonalCustomer(
  customer: Customer
): customer is PersonalCustomerResponse {
  return "firstName" in customer || customer.customerType === CustomerType.PERSONAL;
}

export default function Customer() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");

  // Debounce search (important for performance)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchKeyword.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Data
  const { data: allCustomers = [], isLoading, isError } = useCustomers();
  const { data: searchResults = [], isLoading: isSearching } =
    useSearchCustomers(debouncedSearch);

  // Mutations
  const createPersonalMutation = useCreatePersonalCustomer();
  const createCorporateMutation = useCreateCorporateCustomer();
  const updatePersonalMutation = useUpdatePersonalCustomer();
  const updateCorporateMutation = useUpdateCorporateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formType, setFormType] = useState<CustomerType>(CustomerType.PERSONAL);

  // Forms
  const [personalForm, setPersonalForm] = useState<PersonalCustomerCreateRequest>({
    customerCode: "",
    firstName: "",
    lastName: "",
    nic: "",
    dateOfBirth: "",
    gender: Gender.MALE,
    occupation: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    country: "",
  });

  const [corporateForm, setCorporateForm] = useState<CorporateCustomerCreateRequest>({
    customerCode: "",
    companyName: "",
    registrationNumber: "",
    industry: "",
    contactPerson: "",
    contactDesignation: "",
    contactPhone: "",
    website: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    country: "",
  });

  // Memoized filtered list
  const filteredCustomers = useMemo(() => {
    const base = debouncedSearch ? searchResults : allCustomers;

    return base.filter((cust) => {
      const isPersonal = isPersonalCustomer(cust);

      const matchesType =
        selectedTypeFilter === "ALL" ||
        (selectedTypeFilter === CustomerType.PERSONAL && isPersonal) ||
        (selectedTypeFilter === CustomerType.CORPORATE && !isPersonal);

      const matchesStatus =
        selectedStatusFilter === "ALL" || cust.status === selectedStatusFilter;

      return matchesType && matchesStatus;
    });
  }, [allCustomers, searchResults, debouncedSearch, selectedTypeFilter, selectedStatusFilter]);

  const resetForms = useCallback(() => {
    setPersonalForm({
      customerCode: "",
      firstName: "",
      lastName: "",
      nic: "",
      dateOfBirth: "",
      gender: Gender.MALE,
      occupation: "",
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      country: "",
    });
    setCorporateForm({
      customerCode: "",
      companyName: "",
      registrationNumber: "",
      industry: "",
      contactPerson: "",
      contactDesignation: "",
      contactPhone: "",
      website: "",
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      country: "",
    });
    setEditingCustomer(null);
  }, []);

  const handleOpenCreateModal = useCallback(
    (type: CustomerType) => {
      resetForms();
      setFormType(type);
      setIsModalOpen(true);
    },
    [resetForms]
  );

  const handleOpenEditModal = useCallback(
    (customer: Customer) => {
      resetForms();
      setEditingCustomer(customer);

      if (isPersonalCustomer(customer)) {
        setFormType(CustomerType.PERSONAL);
        setPersonalForm({
          customerCode: customer.customerCode,
          firstName: customer.firstName,
          lastName: customer.lastName,
          nic: customer.nic,
          dateOfBirth: customer.dateOfBirth,
          gender: customer.gender,
          occupation: customer.occupation,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          address: customer.address,
          city: customer.city,
          country: customer.country,
        });
      } else {
        setFormType(CustomerType.CORPORATE);
        setCorporateForm({
          customerCode: customer.customerCode,
          companyName: customer.companyName,
          registrationNumber: customer.registrationNumber,
          industry: customer.industry,
          contactPerson: customer.contactPerson,
          contactDesignation: customer.contactDesignation,
          contactPhone: customer.contactPhone,
          website: customer.website,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
          address: customer.address,
          city: customer.city,
          country: customer.country,
        });
      }
      setIsModalOpen(true);
    },
    [resetForms]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    resetForms();
  }, [resetForms]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (window.confirm("Are you sure you want to delete this customer?")) {
        await deleteCustomerMutation.mutateAsync(id);
      }
    },
    [deleteCustomerMutation]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        if (editingCustomer) {
          if (formType === CustomerType.PERSONAL) {
            const payload: PersonalCustomerUpdateRequest = {
              firstName: personalForm.firstName,
              lastName: personalForm.lastName,
              nic: personalForm.nic,
              dateOfBirth: personalForm.dateOfBirth,
              gender: personalForm.gender,
              occupation: personalForm.occupation,
              email: personalForm.email,
              phoneNumber: personalForm.phoneNumber,
              address: personalForm.address,
              city: personalForm.city,
              country: personalForm.country,
            };
            await updatePersonalMutation.mutateAsync({
              id: editingCustomer.id,
              data: payload,
            });
          } else {
            const payload: CorporateCustomerUpdateRequest = {
              companyName: corporateForm.companyName,
              registrationNumber: corporateForm.registrationNumber,
              industry: corporateForm.industry,
              contactPerson: corporateForm.contactPerson,
              contactDesignation: corporateForm.contactDesignation,
              contactPhone: corporateForm.contactPhone,
              website: corporateForm.website,
              email: corporateForm.email,
              phoneNumber: corporateForm.phoneNumber,
              address: corporateForm.address,
              city: corporateForm.city,
              country: corporateForm.country,
            };
            await updateCorporateMutation.mutateAsync({
              id: editingCustomer.id,
              data: payload,
            });
          }
        } else {
          if (formType === CustomerType.PERSONAL) {
            await createPersonalMutation.mutateAsync(personalForm);
          } else {
            await createCorporateMutation.mutateAsync(corporateForm);
          }
        }

        handleCloseModal();
      } catch (error) {
        // Error handling can be improved with toast later
        console.error(error);
      }
    },
    [
      editingCustomer,
      formType,
      personalForm,
      corporateForm,
      createPersonalMutation,
      createCorporateMutation,
      updatePersonalMutation,
      updateCorporateMutation,
      handleCloseModal,
    ]
  );

  const isSubmitting =
    createPersonalMutation.isPending ||
    createCorporateMutation.isPending ||
    updatePersonalMutation.isPending ||
    updateCorporateMutation.isPending;

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15";

  const labelClass = "block text-xs font-semibold text-slate-600";

  return (
    <div className="space-y-6">
      {/* Top Actions & Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, code, email..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
            />
          </div>

          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
          >
            <option value="ALL">All Types</option>
            <option value={CustomerType.PERSONAL}>Personal</option>
            <option value={CustomerType.CORPORATE}>Corporate</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
          >
            <option value="ALL">All Statuses</option>
            <option value={Status.ACTIVE}>Active</option>
            <option value={Status.INACTIVE}>Inactive</option>
            <option value={Status.SUSPENDED}>Suspended</option>
          </select>
        </div>

        {/* Add Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenCreateModal(CustomerType.PERSONAL)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30"
          >
            <User className="h-4 w-4" />
            Personal
          </button>
          <button
            onClick={() => handleOpenCreateModal(CustomerType.CORPORATE)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600 px-4 py-2.5 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/30"
          >
            <Building2 className="h-4 w-4" />
            Corporate
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3.5 font-semibold">Code</th>
                <th className="px-5 py-3.5 font-semibold">Name / Company</th>
                <th className="px-5 py-3.5 font-semibold">Type</th>
                <th className="px-5 py-3.5 font-semibold">Email & Phone</th>
                <th className="px-5 py-3.5 font-semibold">Location</th>
                <th className="px-5 py-3.5 font-semibold">Status</th>
                <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading || isSearching ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span>Loading customers...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-rose-500">
                      <AlertTriangle className="h-6 w-6" />
                      <span>Failed to load customers. Please try again.</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-slate-400">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const isPersonal = isPersonalCustomer(cust);
                  const displayName = isPersonal
                    ? `${cust.firstName} ${cust.lastName}`
                    : cust.companyName;

                  return (
                    <tr key={cust.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        {cust.customerCode}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">
                        {displayName}
                      </td>
                      <td className="px-5 py-3.5">
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
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-slate-700">{cust.email}</div>
                        <div className="text-xs text-slate-400">{cust.phoneNumber}</div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {cust.city}, {cust.country}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            cust.status === Status.ACTIVE
                              ? "bg-emerald-100 text-emerald-800"
                              : cust.status === Status.SUSPENDED
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {cust.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Button */}
                          <Link
                            href={`/dashboard/customer/${cust.id}`}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEditModal(cust)}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(cust.id)}
                            disabled={deleteCustomerMutation.isPending}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editingCustomer ? "Edit Customer" : "Add New Customer"}
                </h3>
                <p className="text-sm text-slate-500">
                  {formType === CustomerType.PERSONAL ? "Personal Customer" : "Corporate Customer"}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {formType === CustomerType.PERSONAL ? (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {!editingCustomer && (
                      <div>
                        <label htmlFor="customerCode" className={labelClass}>
                          Customer Code *
                        </label>
                        <input
                          id="customerCode"
                          type="text"
                          required
                          value={personalForm.customerCode}
                          onChange={(e) =>
                            setPersonalForm({ ...personalForm, customerCode: e.target.value })
                          }
                          className={inputClass}
                        />
                      </div>
                    )}
                    <div>
                      <label htmlFor="firstName" className={labelClass}>
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        required
                        value={personalForm.firstName}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, firstName: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelClass}>
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        required
                        value={personalForm.lastName}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, lastName: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="nic" className={labelClass}>
                        NIC / Identity No *
                      </label>
                      <input
                        id="nic"
                        type="text"
                        required
                        value={personalForm.nic}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, nic: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="dateOfBirth" className={labelClass}>
                        Date of Birth *
                      </label>
                      <input
                        id="dateOfBirth"
                        type="date"
                        required
                        value={personalForm.dateOfBirth}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, dateOfBirth: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="gender" className={labelClass}>
                        Gender *
                      </label>
                      <select
                        id="gender"
                        value={personalForm.gender}
                        onChange={(e) =>
                          setPersonalForm({
                            ...personalForm,
                            gender: e.target.value as Gender,
                          })
                        }
                        className={inputClass}
                      >
                        <option value={Gender.MALE}>Male</option>
                        <option value={Gender.FEMALE}>Female</option>
                        <option value={Gender.OTHER}>Other</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="occupation" className={labelClass}>
                        Occupation *
                      </label>
                      <input
                        id="occupation"
                        type="text"
                        required
                        value={personalForm.occupation}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, occupation: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={personalForm.email}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, email: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className={labelClass}>
                        Phone Number *
                      </label>
                      <input
                        id="phoneNumber"
                        type="text"
                        required
                        value={personalForm.phoneNumber}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, phoneNumber: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-3">
                      <label htmlFor="address" className={labelClass}>
                        Address *
                      </label>
                      <input
                        id="address"
                        type="text"
                        required
                        value={personalForm.address}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, address: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className={labelClass}>
                        City *
                      </label>
                      <input
                        id="city"
                        type="text"
                        required
                        value={personalForm.city}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, city: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className={labelClass}>
                        Country *
                      </label>
                      <input
                        id="country"
                        type="text"
                        required
                        value={personalForm.country}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, country: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Corporate Form */
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {!editingCustomer && (
                      <div>
                        <label htmlFor="corpCustomerCode" className={labelClass}>
                          Customer Code *
                        </label>
                        <input
                          id="corpCustomerCode"
                          type="text"
                          required
                          value={corporateForm.customerCode}
                          onChange={(e) =>
                            setCorporateForm({
                              ...corporateForm,
                              customerCode: e.target.value,
                            })
                          }
                          className={inputClass}
                        />
                      </div>
                    )}
                    <div>
                      <label htmlFor="companyName" className={labelClass}>
                        Company Name *
                      </label>
                      <input
                        id="companyName"
                        type="text"
                        required
                        value={corporateForm.companyName}
                        onChange={(e) =>
                          setCorporateForm({
                            ...corporateForm,
                            companyName: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="registrationNumber" className={labelClass}>
                        Registration Number *
                      </label>
                      <input
                        id="registrationNumber"
                        type="text"
                        required
                        value={corporateForm.registrationNumber}
                        onChange={(e) =>
                          setCorporateForm({
                            ...corporateForm,
                            registrationNumber: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="industry" className={labelClass}>
                        Industry *
                      </label>
                      <input
                        id="industry"
                        type="text"
                        required
                        value={corporateForm.industry}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, industry: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="contactPerson" className={labelClass}>
                        Contact Person *
                      </label>
                      <input
                        id="contactPerson"
                        type="text"
                        required
                        value={corporateForm.contactPerson}
                        onChange={(e) =>
                          setCorporateForm({
                            ...corporateForm,
                            contactPerson: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="contactDesignation" className={labelClass}>
                        Contact Designation *
                      </label>
                      <input
                        id="contactDesignation"
                        type="text"
                        required
                        value={corporateForm.contactDesignation}
                        onChange={(e) =>
                          setCorporateForm({
                            ...corporateForm,
                            contactDesignation: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="contactPhone" className={labelClass}>
                        Contact Phone *
                      </label>
                      <input
                        id="contactPhone"
                        type="text"
                        required
                        value={corporateForm.contactPhone}
                        onChange={(e) =>
                          setCorporateForm({
                            ...corporateForm,
                            contactPhone: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="website" className={labelClass}>
                        Website
                      </label>
                      <input
                        id="website"
                        type="text"
                        value={corporateForm.website}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, website: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="corpEmail" className={labelClass}>
                        Company Email *
                      </label>
                      <input
                        id="corpEmail"
                        type="email"
                        required
                        value={corporateForm.email}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, email: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="corpPhone" className={labelClass}>
                        Company Phone *
                      </label>
                      <input
                        id="corpPhone"
                        type="text"
                        required
                        value={corporateForm.phoneNumber}
                        onChange={(e) =>
                          setCorporateForm({
                            ...corporateForm,
                            phoneNumber: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-3">
                      <label htmlFor="corpAddress" className={labelClass}>
                        Address *
                      </label>
                      <input
                        id="corpAddress"
                        type="text"
                        required
                        value={corporateForm.address}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, address: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="corpCity" className={labelClass}>
                        City *
                      </label>
                      <input
                        id="corpCity"
                        type="text"
                        required
                        value={corporateForm.city}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, city: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="corpCountry" className={labelClass}>
                        Country *
                      </label>
                      <input
                        id="corpCountry"
                        type="text"
                        required
                        value={corporateForm.country}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, country: e.target.value })
                        }
                        className={inputClass}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting
                    ? "Saving..."
                    : editingCustomer
                    ? "Update Customer"
                    : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}