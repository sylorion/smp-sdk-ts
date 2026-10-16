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
  /** Utilisateur responsable du contact (lead), déduit de `assignedToUserOrgID`. */
  assigneeUserID?: string | null;
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

/** Filtres d'une liste ; `assignee` : `me`, `unassigned` ou l'identifiant d'un membre. */
export interface ContactListFilters {
  search?: string;
  status?: string;
  source?: string;
  page?: number;
  pageSize?: number;
  assignee?: 'me' | 'unassigned' | string;
}

export interface HandOverContactInput {
  contactID: string;
  /** Collègue qui reprend le lead (membre de l'organisation, différent de l'appelant). */
  toUserID: string;
  message?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  /** ISO 8601. */
  dueAt?: string;
}

/**
 * Note : depuis le CRM (mu-organization), l'appelant est TOUJOURS l'identité signée du client
 * (`APIClient.withUserAssertion` côté serveur) ; le paramètre `callerUserID` des méthodes est
 * conservé pour compatibilité mais ignoré par le service.
 */
// ── Controller ──

export class ContactController {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  // ── Queries ──

  async list(
    organizationID: string,
    callerUserID: string,
    filters?: ContactListFilters,
  ): Promise<OrganizationContact[]> {
    const query = contactQueries.GET_ORGANIZATION_CONTACTS;
    const variables = { organizationID, callerUserID, ...filters };
    const response = await this.client.query(query, variables) as { organizationContacts: OrganizationContact[] };
    return response.organizationContacts;
  }

  async getById(contactID: string, callerUserID: string): Promise<OrganizationContact> {
    const query = contactQueries.GET_ORGANIZATION_CONTACT;
    const variables = { contactID, callerUserID };
    const response = await this.client.query(query, variables) as { organizationContact: OrganizationContact };
    return response.organizationContact;
  }

  async search(organizationID: string, callerUserID: string, query: string, limit?: number): Promise<OrganizationContact[]> {
    const gqlQuery = contactQueries.SEARCH_ORGANIZATION_CONTACTS;
    const variables = { organizationID, callerUserID, query, limit };
    const response = await this.client.query(gqlQuery, variables) as { searchOrganizationContacts: OrganizationContact[] };
    return response.searchOrganizationContacts;
  }

  // ── Mutations ──

  async create(input: CreateContactInput & { callerUserID: string }): Promise<OrganizationContact> {
    const mutation = contactMutations.CREATE_CONTACT;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { createOrganizationContact: OrganizationContact };
    return response.createOrganizationContact;
  }

  async update(contactID: string, callerUserID: string, input: UpdateContactInput): Promise<OrganizationContact> {
    const mutation = contactMutations.UPDATE_CONTACT;
    const variables = { contactID, callerUserID, input };
    const response = await this.client.mutate(mutation, variables) as { updateOrganizationContact: OrganizationContact };
    return response.updateOrganizationContact;
  }

  async delete(contactID: string, callerUserID: string): Promise<boolean> {
    const mutation = contactMutations.DELETE_CONTACT;
    const variables = { contactID, callerUserID };
    const response = await this.client.mutate(mutation, variables) as { deleteOrganizationContact: { success: boolean } };
    return response.deleteOrganizationContact.success;
  }

  async bulkCreate(
    organizationID: string,
    callerUserID: string,
    contacts: BulkContactInput[],
  ): Promise<{ success: boolean; created: number; skipped?: number; message?: string }> {
    const mutation = contactMutations.BULK_CREATE_CONTACTS;
    const variables = { organizationID, callerUserID, contacts };
    const response = await this.client.mutate(mutation, variables) as { bulkCreateOrganizationContacts: any };
    return response.bulkCreateOrganizationContacts;
  }

  async setPrivacy(contactID: string, callerUserID: string, isPrivate: boolean): Promise<OrganizationContact> {
    const mutation = contactMutations.SET_CONTACT_PRIVACY;
    const variables = { contactID, callerUserID, isPrivate };
    const response = await this.client.mutate(mutation, variables) as { setOrganizationContactPrivacy: OrganizationContact };
    return response.setOrganizationContactPrivacy;
  }

  // ── CRM : responsable d'un lead ──

  /** `assigneeUserID` null : le contact n'a plus de responsable. */
  async assign(contactID: string, assigneeUserID: string | null): Promise<OrganizationContact> {
    const input = assigneeUserID ? { contactID, assigneeUserID } : { contactID };
    const response = await this.client.mutate(contactMutations.ASSIGN_CONTACT, { input }) as { assignOrganizationContact: OrganizationContact };
    return response.assignOrganizationContact;
  }

  async handOver(input: HandOverContactInput): Promise<OrganizationContact> {
    const response = await this.client.mutate(contactMutations.HAND_OVER_CONTACT, { input }) as { handOverOrganizationContact: OrganizationContact };
    return response.handOverOrganizationContact;
  }
}
