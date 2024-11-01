// smp-sdk-ts/src/organization/organization.ts

import { APIClient } from '../api/APIClient';
import { organizationQueries } from '../api/graphql/queries/organizationQueries';

/**
 * The `Organization` class manages organization-related requests within the application.
 */
export class Organization {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  async list(pagination?: any, sort?: any, filter?: any) {
    const query = organizationQueries.GET_ORGANIZATIONS;
    const variables = { pagination, sort, filter };
    const response = await this.client.query(query, variables);
    return response.data.organizations;
  }

  async getById(organizationID: string) {
    const query = organizationQueries.GET_ORGANIZATION_BY_ID;
    const variables = { organizationID };
    const response = await this.client.query(query, variables);
    return response.data.organizationByID;
  }

  async getByIDs(organizationIDs: string[]) {
    const query = organizationQueries.GET_ORGANIZATIONS_BY_IDS;
    const variables = { organizationIDs };
    const response = await this.client.query(query, variables);
    return response.data.organizationsByIDs;
  }

  async getByUniqRef(uniqRef: string) {
    const query = organizationQueries.GET_ORGANIZATION_BY_UNIQ_REF;
    const variables = { uniqRef };
    const response = await this.client.query(query, variables);
    return response.data.organizationByUniqRef;
  }

  async getBySlug(slug: string) {
    const query = organizationQueries.GET_ORGANIZATION_BY_SLUG;
    const variables = { slug };
    const response = await this.client.query(query, variables);
    return response.data.organizationBySlug;
  }

  async getBySlugs(slugs: string[]) {
    const query = organizationQueries.GET_ORGANIZATIONS_BY_SLUGS;
    const variables = { slugs };
    const response = await this.client.query(query, variables);
    return response.data.organizationsBySlugs;
  }
}
