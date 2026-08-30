// src/services/customer.service.ts

import apiClient from "../lib/apiClient";
import {
  Customer,
  CustomerType,
  Status,
  PersonalCustomerCreateRequest,
  PersonalCustomerUpdateRequest,
  PersonalCustomerResponse,
  CorporateCustomerCreateRequest,
  CorporateCustomerUpdateRequest,
  CorporateCustomerResponse,
} from "../lib/types/customer";

// =====================================
// PERSONAL CUSTOMERS
// =====================================

export const createPersonalCustomer = async (
  data: PersonalCustomerCreateRequest
): Promise<PersonalCustomerResponse> => {
  const response = await apiClient.post(
    "api/customers/personal",
    data
  );
  return response.data;
};

export const updatePersonalCustomer = async (
  id: number,
  data: PersonalCustomerUpdateRequest
): Promise<PersonalCustomerResponse> => {
  const response = await apiClient.put(
    `api/customers/personal/${id}`,
    data
  );
  return response.data;
};

// =====================================
// CORPORATE CUSTOMERS
// =====================================

export const createCorporateCustomer = async (
  data: CorporateCustomerCreateRequest
): Promise<CorporateCustomerResponse> => {
  const response = await apiClient.post(
    "api/customers/corporate",
    data
  );
  return response.data;
};

export const updateCorporateCustomer = async (
  id: number,
  data: CorporateCustomerUpdateRequest
): Promise<CorporateCustomerResponse> => {
  const response = await apiClient.put(
    `api/customers/corporate/${id}`,
    data
  );
  return response.data;
};

// =====================================
// COMMON OPERATIONS
// =====================================

export const getAllCustomers = async (): Promise<Customer[]> => {
  const response = await apiClient.get("api/customers");
  return response.data;
};

export const getCustomerById = async (
  id: number
): Promise<Customer> => {
  const response = await apiClient.get(`api/customers/${id}`);
  return response.data;
};

export const getCustomerByCode = async (
  customerCode: string
): Promise<Customer> => {
  const response = await apiClient.get(
    `api/customers/code/${customerCode}`
  );
  return response.data;
};

export const getCustomerByEmail = async (
  email: string
): Promise<Customer> => {
  const response = await apiClient.get(
    `api/customers/email/${email}`
  );
  return response.data;
};

export const getCustomersByType = async (
  type: CustomerType
): Promise<Customer[]> => {
  const response = await apiClient.get(
    `api/customers/type/${type}`
  );
  return response.data;
};

export const getCustomersByStatus = async (
  status: Status
): Promise<Customer[]> => {
  const response = await apiClient.get(
    `api/customers/status/${status}`
  );
  return response.data;
};

export const searchCustomers = async (
  keyword: string
): Promise<Customer[]> => {
  const response = await apiClient.get("api/customers/search", {
    params: {
      keyword,
    },
  });

  return response.data;
};

export const deleteCustomer = async (
  id: number
): Promise<void> => {
  await apiClient.delete(`api/customers/${id}`);
};