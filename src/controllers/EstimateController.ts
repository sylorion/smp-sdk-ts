// smp-sdk-ts/src/estimate/estimate.ts

import { APIClient } from '../api/APIClient';
import { estimateQueries } from '../api/graphql/queries/accounting/estimateQueries';

/**
 * The `Estimate` class manages estimate-related requests within the application.
 * Provides methods to retrieve, list, and search estimates.
 */
export class Estimate {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  /**
   * Retrieves a list of estimates with optional pagination, sorting, and filters.
   */
  async list(pagination?: any, sort?: any, filter?: any): Promise<any[]> {
    const query = estimateQueries.GET_ESTIMATES;
    const variables = { pagination, sort, filter };
    const response = await this.client.query(query, variables) as { data: { estimates: any[] } };
    return response.data.estimates;
  }

  /**
   * Fetches an estimate by its unique ID.
   */
  async getById(estimateID: string): Promise<any> {
    const query = estimateQueries.GET_ESTIMATE_BY_ID;
    const variables = { estimateID };
    const response = await this.client.query(query, variables) as { data: { estimateByID: any } };
    return response.data.estimateByID;
  }

  /**
   * Fetches multiple estimates by an array of estimate IDs.
   */
  async getByIDs(estimateIDs: string[]): Promise<any[]> {
    const query = estimateQueries.GET_ESTIMATES_BY_IDS;
    const variables = { estimateIDs };
    const response = await this.client.query(query, variables) as { data: { estimatesByIDs: any[] } };
    return response.data.estimatesByIDs;
  }

  /**
   * Fetches an estimate by its unique reference (`uniqRef`).
   */
  async getByUniqRef(uniqRef: string): Promise<any> {
    const query = estimateQueries.GET_ESTIMATE_BY_UNIQ_REF;
    const variables = { uniqRef };
    const response = await this.client.query(query, variables) as { data: { estimateByUniqRef: any } };
    return response.data.estimateByUniqRef;
  }

  /**
   * Fetches an estimate by its slug.
   */
  async getBySlug(slug: string): Promise<any> {
    const query = estimateQueries.GET_ESTIMATE_BY_SLUG;
    const variables = { slug };
    const response = await this.client.query(query, variables) as { data: { estimateBySlug: any } };
    return response.data.estimateBySlug;
  }

  /**
   * Fetches multiple estimates by their slugs.
   */
  async getBySlugs(slugs: string[]): Promise<any[]> {
    const query = estimateQueries.GET_ESTIMATES_BY_SLUGS;
    const variables = { slugs };
    const response = await this.client.query(query, variables) as { data: { estimatesBySlugs: any[] } };
    return response.data.estimatesBySlugs;
  }
}
