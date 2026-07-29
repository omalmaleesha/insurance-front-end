// lib/types/quotation.ts

export type CurrencyType =
  | "LKR"
  | "USD"
  | "EUR"
  | "GBP";

export type QuotationType =
  | "PRIVATE_HOUSE"
  | "BUSINESS_PREMISES"
  | "INDUSTRIAL_PREMISES";

export type QuotationStatus =
  | "DRAFT"
  | "CALCULATED"
  | "APPROVED"
  | "REJECTED"
  | "ISSUED";

export interface ResidentialRiskRequest {
  propertyName: string;
  locationAddress: string;

  buildingSumInsured: number;
  contentsSumInsured: number;

  hasFireAlarm: boolean;
  hasAutomaticSprinklers: boolean;
  distanceToNearestFireStationKm: number;

  constructionMaterialClass: string;
  numberOfFloors: number;
  yearBuilt: number;
  occupancyType: string;
  isSecuredGatedProperty: boolean;
}

export interface CommercialRiskRequest {
  propertyName: string;
  locationAddress: string;

  buildingSumInsured: number;
  contentsSumInsured: number;

  hasFireAlarm: boolean;
  hasAutomaticSprinklers: boolean;
  distanceToNearestFireStationKm: number;

  businessActivity: string;
  footTrafficLevel: string;

  hasServerRoom: boolean;
  hasKitchenOrCookingFacility: boolean;
  hasHoseReels: boolean;
}

export interface IndustrialRiskRequest {
  propertyName: string;
  locationAddress: string;

  buildingSumInsured: number;
  contentsSumInsured: number;

  hasFireAlarm: boolean;
  hasAutomaticSprinklers: boolean;
  distanceToNearestFireStationKm: number;

  manufacturingType: string;
  machinerySumInsured: number;

  hasFlammableMaterials: boolean;
  flammableMaterialCategory: string;

  hasBoilersOrHeavyMachinery: boolean;
  hasOnsiteHydrants: boolean;
  hasFireDoorsAndWalls: boolean;
}

export interface CreateQuotationRequest {
  customerName: string;
  currency: CurrencyType;
  quotationType: QuotationType;

  residentialRisk?: ResidentialRiskRequest;
  commercialRisk?: CommercialRiskRequest;
  industrialRisk?: IndustrialRiskRequest;
}

export interface QuotationResponse {
  id: number;

  quotationReference: string;

  customerName: string;

  currency: CurrencyType;

  quotationType: QuotationType;

  status: QuotationStatus;

  totalSumInsured: number;

  netPremium: number;

  taxAndLeviesAmount: number;

  grandTotalPremium: number;
}