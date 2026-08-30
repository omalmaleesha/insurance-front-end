// ================================
// ENUMS
// ================================

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum CustomerType {
  PERSONAL = "PERSONAL",
  CORPORATE = "CORPORATE",
}

// ================================
// BASE CUSTOMER
// ================================

export interface CustomerCreateRequest {
  customerCode: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  status: Status;
}

export interface CustomerUpdateRequest {
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  status: Status;
}

export interface CustomerResponse {
  id: number;
  customerCode: string;
  customerType?: CustomerType;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

// ================================
// PERSONAL CUSTOMER
// ================================

export interface PersonalCustomerCreateRequest {
  customerCode: string;
  firstName: string;
  lastName: string;
  nic: string;
  dateOfBirth: string; // yyyy-MM-dd
  gender: Gender;
  occupation: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
}

export interface PersonalCustomerUpdateRequest {
  firstName: string;
  lastName: string;
  nic: string;
  dateOfBirth: string;
  gender: Gender;
  occupation: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
}

export interface PersonalCustomerResponse {
  id: number;
  customerCode: string;
  customerType?: CustomerType;
  firstName: string;
  lastName: string;
  nic: string;
  dateOfBirth: string;
  gender: Gender;
  occupation: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

// ================================
// CORPORATE CUSTOMER
// ================================

export interface CorporateCustomerCreateRequest {
  customerCode: string;
  companyName: string;
  registrationNumber: string;
  industry: string;
  contactPerson: string;
  contactDesignation: string;
  contactPhone: string;
  website: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
}

export interface CorporateCustomerUpdateRequest {
  companyName: string;
  registrationNumber: string;
  industry: string;
  contactPerson: string;
  contactDesignation: string;
  contactPhone: string;
  website: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
}

export interface CorporateCustomerResponse {
  id: number;
  customerCode: string;
  customerType?: CustomerType;
  companyName: string;
  registrationNumber: string;
  industry: string;
  contactPerson: string;
  contactDesignation: string;
  contactPhone: string;
  website: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

// ================================
// UNION TYPES
// ================================

export type Customer =
  | PersonalCustomerResponse
  | CorporateCustomerResponse;

export type CreateCustomer =
  | PersonalCustomerCreateRequest
  | CorporateCustomerCreateRequest;

export type UpdateCustomer =
  | PersonalCustomerUpdateRequest
  | CorporateCustomerUpdateRequest;