"use client";

import { useState } from "react";
import {
  useCustomers,
  useCreatePersonalCustomer,
  useCreateCorporateCustomer,
  useUpdatePersonalCustomer,
  useUpdateCorporateCustomer,
  useDeleteCustomer,
  useSearchCustomers,
} from "../hooks/useCustomer";
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
} from "../lib/types/customer";

// Type guard helper to check customer type safely
function isPersonalCustomer(
  customer: Customer
): customer is PersonalCustomerResponse {
  return "firstName" in customer || customer.customerType === CustomerType.PERSONAL;
}

export default function Customer() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");

  // Fetch data
  const { data: allCustomers = [], isLoading, isError } = useCustomers();
  const { data: searchResults = [], isLoading: isSearching } = useSearchCustomers(searchKeyword);

  // Mutations
  const createPersonalMutation = useCreatePersonalCustomer();
  const createCorporateMutation = useCreateCorporateCustomer();
  const updatePersonalMutation = useUpdatePersonalCustomer();
  const updateCorporateMutation = useUpdateCorporateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formType, setFormType] = useState<CustomerType>(CustomerType.PERSONAL);

  // Form states
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

  // Decide which dataset to filter
  const baseCustomers = searchKeyword.trim() ? searchResults : allCustomers;

  // Filter dataset by Type and Status
  const filteredCustomers = baseCustomers.filter((cust) => {
    const isPersonal = isPersonalCustomer(cust);
    const matchesType =
      selectedTypeFilter === "ALL" ||
      (selectedTypeFilter === CustomerType.PERSONAL && isPersonal) ||
      (selectedTypeFilter === CustomerType.CORPORATE && !isPersonal);

    const matchesStatus =
      selectedStatusFilter === "ALL" || cust.status === selectedStatusFilter;

    return matchesType && matchesStatus;
  });

  const resetForms = () => {
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
  };

  const handleOpenCreateModal = (type: CustomerType) => {
    resetForms();
    setFormType(type);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer: Customer) => {
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
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      await deleteCustomerMutation.mutateAsync(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        await updatePersonalMutation.mutateAsync({ id: editingCustomer.id, data: payload });
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
        await updateCorporateMutation.mutateAsync({ id: editingCustomer.id, data: payload });
      }
    } else {
      if (formType === CustomerType.PERSONAL) {
        await createPersonalMutation.mutateAsync(personalForm);
      } else {
        await createCorporateMutation.mutateAsync(corporateForm);
      }
    }

    setIsModalOpen(false);
    resetForms();
  };

  const isSubmitting =
    createPersonalMutation.isPending ||
    createCorporateMutation.isPending ||
    updatePersonalMutation.isPending ||
    updateCorporateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Top Actions & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value={CustomerType.PERSONAL}>Personal</option>
            <option value={CustomerType.CORPORATE}>Corporate</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value={Status.ACTIVE}>Active</option>
            <option value={Status.INACTIVE}>Inactive</option>
            <option value={Status.SUSPENDED}>Suspended</option>
          </select>
        </div>

        {/* Add Customer Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleOpenCreateModal(CustomerType.PERSONAL)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            + Personal
          </button>
          <button
            onClick={() => handleOpenCreateModal(CustomerType.CORPORATE)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-600 px-4 py-2 text-sm font-semibold text-emerald-600 shadow-sm hover:bg-emerald-50"
          >
            + Corporate
          </button>
        </div>
      </div>

      {/* Customer List Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Name / Company</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Email & Phone</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading || isSearching ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Loading customers...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-rose-500">
                  Failed to load customers. Please try again.
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No customers found.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((cust: Customer) => {
                const isPersonal = isPersonalCustomer(cust);
                const displayName = isPersonal
                  ? `${cust.firstName} ${cust.lastName}`
                  : cust.companyName;

                return (
                  <tr key={cust.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {cust.customerCode}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {displayName}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${
                          isPersonal
                            ? "bg-blue-50 text-blue-700"
                            : "bg-purple-50 text-purple-700"
                        }`}
                      >
                        {isPersonal ? "Personal" : "Corporate"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>{cust.email}</div>
                      <div className="text-xs text-slate-400">{cust.phoneNumber}</div>
                    </td>
                    <td className="px-4 py-3">
                      {cust.city}, {cust.country}
                    </td>
                    <td className="px-4 py-3">
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
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleOpenEditModal(cust)}
                        className="mr-3 font-medium text-emerald-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cust.id)}
                        className="font-medium text-rose-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editingCustomer ? "Edit Customer" : "Add New Customer"} (
                {formType === CustomerType.PERSONAL ? "Personal" : "Corporate"})
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Form Fields: Personal */}
              {formType === CustomerType.PERSONAL ? (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {!editingCustomer && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-600">
                          Customer Code
                        </label>
                        <input
                          type="text"
                          required
                          value={personalForm.customerCode}
                          onChange={(e) =>
                            setPersonalForm({ ...personalForm, customerCode: e.target.value })
                          }
                          className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={personalForm.firstName}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, firstName: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={personalForm.lastName}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, lastName: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        NIC / Identity No
                      </label>
                      <input
                        type="text"
                        required
                        value={personalForm.nic}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, nic: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        required
                        value={personalForm.dateOfBirth}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, dateOfBirth: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Gender
                      </label>
                      <select
                        value={personalForm.gender}
                        onChange={(e) =>
                          setPersonalForm({
                            ...personalForm,
                            gender: e.target.value as Gender,
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      >
                        <option value={Gender.MALE}>Male</option>
                        <option value={Gender.FEMALE}>Female</option>
                        <option value={Gender.OTHER}>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Occupation
                      </label>
                      <input
                        type="text"
                        required
                        value={personalForm.occupation}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, occupation: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={personalForm.email}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, email: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        required
                        value={personalForm.phoneNumber}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, phoneNumber: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold text-slate-600">
                        Address
                      </label>
                      <input
                        type="text"
                        required
                        value={personalForm.address}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, address: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={personalForm.city}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, city: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Country
                      </label>
                      <input
                        type="text"
                        required
                        value={personalForm.country}
                        onChange={(e) =>
                          setPersonalForm({ ...personalForm, country: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Form Fields: Corporate */
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {!editingCustomer && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-600">
                          Customer Code
                        </label>
                        <input
                          type="text"
                          required
                          value={corporateForm.customerCode}
                          onChange={(e) =>
                            setCorporateForm({ ...corporateForm, customerCode: e.target.value })
                          }
                          className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Company Name
                      </label>
                      <input
                        type="text"
                        required
                        value={corporateForm.companyName}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, companyName: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        required
                        value={corporateForm.registrationNumber}
                        onChange={(e) =>
                          setCorporateForm({
                            ...corporateForm,
                            registrationNumber: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Industry
                      </label>
                      <input
                        type="text"
                        required
                        value={corporateForm.industry}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, industry: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Contact Person
                      </label>
                      <input
                        type="text"
                        required
                        value={corporateForm.contactPerson}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, contactPerson: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Contact Designation
                      </label>
                      <input
                        type="text"
                        required
                        value={corporateForm.contactDesignation}
                        onChange={(e) =>
                          setCorporateForm({
                            ...corporateForm,
                            contactDesignation: e.target.value,
                          })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        required
                        value={corporateForm.contactPhone}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, contactPhone: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Website
                      </label>
                      <input
                        type="text"
                        value={corporateForm.website}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, website: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Company Email
                      </label>
                      <input
                        type="email"
                        required
                        value={corporateForm.email}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, email: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Company Phone
                      </label>
                      <input
                        type="text"
                        required
                        value={corporateForm.phoneNumber}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, phoneNumber: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-3">
                      <label className="block text-xs font-semibold text-slate-600">
                        Address
                      </label>
                      <input
                        type="text"
                        required
                        value={corporateForm.address}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, address: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={corporateForm.city}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, city: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600">
                        Country
                      </label>
                      <input
                        type="text"
                        required
                        value={corporateForm.country}
                        onChange={(e) =>
                          setCorporateForm({ ...corporateForm, country: e.target.value })
                        }
                        className="mt-1 w-full rounded-lg border border-slate-200 p-2 text-sm focus:outline-emerald-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Form Action Buttons */}
              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                >
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