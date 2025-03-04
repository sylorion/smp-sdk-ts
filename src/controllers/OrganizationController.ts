import { APIClient } from '../api/APIClient';
import { organizationQueries } from '../api/graphql/queries/organization/organizationQueries';
import { organizationMutations } from '../api/graphql/mutations/organization/organizationMutation';

// Types des réponses
export interface Organization {
  organizationID: string;
  uniqRef: string;
  slug: string;
  authorID: number;
  ownerID?: number;
  orgRef?: string;
  sectorID?: number;
  legalName: string;
  brand?: string;
  sigle?: string;
  smallLogoID?: string;
  bigLogoID?: string;
  bannerID?: string;
  oSize?: string;
  juridicForm?: string;
  juridicCatLabel?: string;
  juridicCatCode?: string;
  currency?: string;
  legalUniqIdentifier?: string;
  vatNumber?: string;
  communityVATNumber?: string;
  capital?: number;
  insuranceRef?: string;
  insuranceName?: string;
  activityStartedAt?: number;
  activityEndedAt?: number;
  description: string;
  summary?: string;
  locationID?: string;
  parentOrganizationID?: string;
  advancedAttributes?: string; // JSON stringifié
  state: string;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  deletedAt?: string; // ISO 8601 format
}

// Types des inputs pour les mutations
export interface CreateOrganizationInput {
  authorID: number;
  ownerID?: number;
  orgRef?: string;
  sectorID?: number;
  legalName: string;
  brand?: string;
  sigle?: string;
  smallLogoID?: string;
  bigLogoID?: string;
  bannerID?: string;
  oSize?: string;
  juridicForm?: string;
  juridicCatLabel?: string;
  juridicCatCode?: string;
  currency?: string;
  legalUniqIdentifier?: string;
  vatNumber?: string;
  communityVATNumber?: string;
  capital?: number;
  insuranceRef?: string;
  insuranceName?: string;
  activityStartedAt?: number;
  activityEndedAt?: number;
  description: string;
  summary?: string;
  locationID?: string;
  parentOrganizationID?: string;
  advancedAttributes?: string; // JSON stringifié
  state: string;
}

export interface UpdateOrganizationInput {
  ownerID?: number;
  orgRef?: string;
  sectorID?: number;
  legalName?: string;
  brand?: string;
  sigle?: string;
  smallLogoID?: string;
  bigLogoID?: string;
  bannerID?: string;
  oSize?: string;
  juridicForm?: string;
  juridicCatLabel?: string;
  juridicCatCode?: string;
  currency?: string;
  legalUniqIdentifier?: string;
  vatNumber?: string;
  communityVATNumber?: string;
  capital?: number;
  insuranceRef?: string;
  insuranceName?: string;
  activityStartedAt?: number;
  activityEndedAt?: number;
  description?: string;
  summary?: string;
  locationID?: string;
  parentOrganizationID?: string;
  advancedAttributes?: string; // JSON stringifié
  state?: string;
}

/**
 * The `Organization` class manages organization-related requests within the application.
 */
export class Organization {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  //========================== QUERIES =============================================================

  /**
   * Fetches a list of organizations with optional pagination, sorting, and filters.
   */
  async list(pagination?: any, sort?: any, filter?: any): Promise<Organization[]> {
    const query = organizationQueries.GET_ORGANIZATIONS;
    const variables = { pagination, sort, filter };
    const response = await this.client.query(query, variables) as { organizations: Organization[]  };
    return response.organizations;
  }

  /**
   * Fetches a single organization by its ID.
   */
  async getById(organizationID: string): Promise<Organization> {
    const query = organizationQueries.GET_ORGANIZATION_BY_ID;
    const variables = { organizationID };
    const response = await this.client.query(query, variables) as { organizationByID: Organization  };
    return response.organizationByID;
  }

  /**
   * Fetches multiple organizations by their IDs.
   */
  async getByIDs(organizationIDs: string[]): Promise<Organization[]> {
    const query = organizationQueries.GET_ORGANIZATIONS_BY_IDS;
    const variables = { organizationIDs };
    const response = await this.client.query(query, variables) as { data: { organizationsByIDs: Organization[] } };
    return response.data.organizationsByIDs;
  }

  /**
   * Fetches a single organization by its unique reference.
   */
  async getByUniqRef(uniqRef: string): Promise<Organization> {
    const query = organizationQueries.GET_ORGANIZATION_BY_UNIQ_REF;
    const variables = { uniqRef };
    const response = await this.client.query(query, variables) as { data: { organizationByUniqRef: Organization } };
    return response.data.organizationByUniqRef;
  }

  /**
   * Fetches a single organization by its slug.
   */
  async getBySlug(slug: string): Promise<Organization> {
    const query = organizationQueries.GET_ORGANIZATION_BY_SLUG;
    const variables = { slug };
    const response = await this.client.query(query, variables) as { data: { organizationBySlug: Organization } };
    return response.data.organizationBySlug;
  }

  /**
   * Fetches multiple organizations by their slugs.
   */
  async getBySlugs(slugs: string[]): Promise<Organization[]> {
    const query = organizationQueries.GET_ORGANIZATIONS_BY_SLUGS;
    const variables = { slugs };
    const response = await this.client.query(query, variables) as { data: { organizationsBySlugs: Organization[] } };
    return response.data.organizationsBySlugs;
  }

  //========================== MUTATIONS =============================================================

  /**
   * Creates a new organization with the specified input.
   */
  async createOrganization(input: CreateOrganizationInput): Promise<Organization> {
    const mutation = organizationMutations.CREATE_ORGANIZATION;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { createOrganization: Organization };
    return response.createOrganization;
  }

  /**
   * Updates an existing organization by its ID with the specified input.
   */
  async updateOrganization(organizationID: string, input: UpdateOrganizationInput): Promise<Organization> {
    const mutation = organizationMutations.UPDATE_ORGANIZATION;
    const variables = { organizationID, input };
    const response = await this.client.mutate(mutation, variables) as { updateOrganization: Organization };
    return response.updateOrganization;
  }

  /**
   * Deletes an organization by its ID.
   */
  async deleteOrganization(organizationID: string): Promise<boolean> {
    const mutation = organizationMutations.DELETE_ORGANIZATION;
    const variables = { organizationID };
    const response = await this.client.mutate(mutation, variables) as { deleteOrganization: boolean };
    return response.deleteOrganization;
  }
}
