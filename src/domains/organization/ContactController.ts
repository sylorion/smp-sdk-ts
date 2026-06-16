import { APIClient } from '../../api/APIClient.js';
import { contactQueries } from '../../api/graphql/organization/contactQueries.js';
import { contactMutations } from '../../api/graphql/organization/contactMutations.js';

// ── Types ──

export interface OrganizationContact {
  contactID: string;
  uniqRef: string;
  slug: string;
  authorID: string;
  organizationID: string;
  userID?: string | null;
  assignedToUserOrgID?: string | null;
  isPrivate: boolean;
  ownerUserOrgID?: string | null;
  contactType: 'individual' | 'company';
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  companyName?: string | null;
  siret?: string | null;
  vatNumber?: string | null;
  legalForm?: string | null;
  rcs?: string | null;
  capital?: string | null;
  logoUrl?: string | null;
  email?: string | null;
  phoneCountryCode?: string | null;
  phone?: string | null;
  mobilePhone?: string | null;
  fax?: string | null;
  website?: string | null;
  locationID?: string | null;
  location?: { placeID: string } | null;
  socialProfiles?: Record<string, string> | null;
  contactStatus: 'active' | 'inactive' | 'prospect' | 'lead' | 'churned' | 'blocked';
  source: 'manual' | 'import' | 'invoice' | 'estimate' | 'engagement' | 'form';
  tags?: string[] | null;
  notes?: string | null;
  preferredLanguage?: string | null;
  preferredCurrency?: string | null;
  isVatExempt?: boolean | null;
  defaultPaymentTerms?: number | null;
  creditLimit?: number | null;
  state: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateContactInput {
  organizationID: string;
  contactType?: 'individual' | 'company';
  firstName?: string;
  lastName?: string;
  displayName?: string;
  companyName?: string;
  siret?: string;
  vatNumber?: string;
  legalForm?: string;
  rcs?: string;
  capital?: string;
  logoUrl?: string;
  email?: string;
  phoneCountryCode?: string;
  phone?: string;
  mobilePhone?: string;
  fax?: string;
  website?: string;
  locationID?: string;
  socialProfiles?: Record<string, string>;
  contactStatus?: string;
  source?: string;
  tags?: string[];
  notes?: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
  isVatExempt?: boolean;
  defaultPaymentTerms?: number;
  creditLimit?: number;
  isPrivate?: boolean;
  assignedToUserOrgID?: string;
  userID?: string;
}

export interface UpdateContactInput {
  contactType?: 'individual' | 'company';
  firstName?: string;
  lastName?: string;
  displayName?: string;
  companyName?: string;
  siret?: string;
  vatNumber?: string;
  legalForm?: string;
  rcs?: string;
  capital?: string;
  logoUrl?: string;
  email?: string;
  phoneCountryCode?: string;
  phone?: string;
  mobilePhone?: string;
  fax?: string;
  website?: string;
  locationID?: string;
  socialProfiles?: Record<string, string>;
  contactStatus?: string;
  source?: string;
  tags?: string[];
  notes?: string;
  preferredLanguage?: string;
  preferredCurrency?: string;
  isVatExempt?: boolean;
  defaultPaymentTerms?: number;
  creditLimit?: number;
  isPrivate?: boolean;
  assignedToUserOrgID?: string;
  userID?: string;
  state?: string;
}

export interface BulkContactInput {
  contactType?: 'individual' | 'company';
  firstName?: string;
  lastName?: string;
  displayName?: string;
  companyName?: string;
  siret?: string;
  vatNumber?: string;
  email?: string;
  phoneCountryCode?: string;
  phone?: string;
  mobilePhone?: string;
  website?: string;
  socialProfiles?: Record<string, string>;
  contactStatus?: string;
  notes?: string;
}

// ── Controller ──

export class ContactController {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  // ── Queries ──

  async list(
    organizationID: string,
    filters?: { search?: string; status?: string; source?: string; page?: number; pageSize?: number },
  ): Promise<OrganizationContact[]> {
    const query = contactQueries.GET_ORGANIZATION_CONTACTS;
    const variables = { organizationID, ...filters };
    const response = await this.client.query(query, variables) as { organizationContacts: OrganizationContact[] };
    return response.organizationContacts;
  }

  async getById(contactID: string): Promise<OrganizationContact> {
    const query = contactQueries.GET_ORGANIZATION_CONTACT;
    const variables = { contactID };
    const response = await this.client.query(query, variables) as { organizationContact: OrganizationContact };
    return response.organizationContact;
  }

  async search(organizationID: string, query: string, limit?: number): Promise<OrganizationContact[]> {
    const gqlQuery = contactQueries.SEARCH_ORGANIZATION_CONTACTS;
    const variables = { organizationID, query, limit };
    const response = await this.client.query(gqlQuery, variables) as { searchOrganizationContacts: OrganizationContact[] };
    return response.searchOrganizationContacts;
  }

  // ── Mutations ──

  async create(input: CreateContactInput): Promise<OrganizationContact> {
    const mutation = contactMutations.CREATE_CONTACT;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { createOrganizationContact: OrganizationContact };
    return response.createOrganizationContact;
  }

  async update(contactID: string, input: UpdateContactInput): Promise<OrganizationContact> {
    const mutation = contactMutations.UPDATE_CONTACT;
    const variables = { contactID, input };
    const response = await this.client.mutate(mutation, variables) as { updateOrganizationContact: OrganizationContact };
    return response.updateOrganizationContact;
  }

  async delete(contactID: string): Promise<boolean> {
    const mutation = contactMutations.DELETE_CONTACT;
    const variables = { contactID };
    const response = await this.client.mutate(mutation, variables) as { deleteOrganizationContact: { success: boolean } };
    return response.deleteOrganizationContact.success;
  }

  async bulkCreate(
    organizationID: string,
    contacts: BulkContactInput[],
  ): Promise<{ success: boolean; created: number; skipped?: number; message?: string }> {
    const mutation = contactMutations.BULK_CREATE_CONTACTS;
    const variables = { organizationID, contacts };
    const response = await this.client.mutate(mutation, variables) as { bulkCreateOrganizationContacts: any };
    return response.bulkCreateOrganizationContacts;
  }

  async setPrivacy(contactID: string, isPrivate: boolean): Promise<OrganizationContact> {
    const mutation = contactMutations.SET_CONTACT_PRIVACY;
    const variables = { contactID, isPrivate };
    const response = await this.client.mutate(mutation, variables) as { setOrganizationContactPrivacy: OrganizationContact };
    return response.setOrganizationContactPrivacy;
  }
}
