// src/types/accounting/billing.ts

export interface BillingAddress {
  street: string;
  city: string;
  zip: string;
  country: string;
  complement?: string;
  countryCode?: string;
}

export interface BillingContact {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface BillingCompany {
  companyName: string;
  siret: string;
  vatNumber?: string;
  logoUrl?: string;
  legalForm?: string;
  rcs?: string;
  capital?: string;
  isVatExempt?: boolean;
}

export type BillingPartyType = 'INDIVIDUAL' | 'COMPANY';

export interface BillingParty {
  type: BillingPartyType;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: BillingAddress;
  company?: BillingCompany;
}

export interface BillingInformation {
  to: BillingParty;
  from: BillingParty;
  tax: number;
}
