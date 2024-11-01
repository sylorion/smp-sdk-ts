// smp-sdk-ts/src/estimate/estimate.ts

import { APIClient } from '../api/APIClient';
import { estimateQueries } from '../api/graphql/queries/estimateQueries';

/**
 * The `Estimate` class manages estimate-related requests within the application.
 * It provides methods to retrieve, list, and search estimates through the `APIClient`.
 */
export class Estimate {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  /**
   * Retrieves a list of estimates with optional pagination, sorting, and filters.
   * @param pagination - Pagination parameters for the request.
   * @param sort - Sorting parameters for the estimates.
   * @param filter - Filters to refine the list of estimates.
   * @returns A list of estimates.
   */
  async list(pagination?: any, sort?: any, filter?: any) {
    const query = estimateQueries.GET_ESTIMATES;
    const variables = { pagination, sort, filter };
    const response = await this.client.query(query, variables);
    return response.data.estimates;
  }

  /**
   * Fetches an estimate by its unique ID.
   * @param estimateID - The ID of the estimate to retrieve.
   * @returns The details of the estimate.
   */
  async getById(estimateID: string) {
    const query = estimateQueries.GET_ESTIMATE_BY_ID;
    const variables = { estimateID };
    const response = await this.client.query(query, variables);
    return response.data.estimateByID;
  }

  /**
   * Fetches multiple estimates by an array of estimate IDs.
   * @param estimateIDs - An array of estimate IDs.
   * @returns A list of estimates.
   */
  async getByIDs(estimateIDs: string[]) {
    const query = estimateQueries.GET_ESTIMATES_BY_IDS;
    const variables = { estimateIDs };
    const response = await this.client.query(query, variables);
    return response.data.estimatesByIDs;
  }

  /**
   * Fetches an estimate by its unique reference (`uniqRef`).
   * @param uniqRef - The estimate's unique reference.
   * @returns The details of the estimate.
   */
  async getByUniqRef(uniqRef: string) {
    const query = estimateQueries.GET_ESTIMATE_BY_UNIQ_REF;
    const variables = { uniqRef };
    const response = await this.client.query(query, variables);
    return response.data.estimateByUniqRef;
  }

  /**
   * Fetches an estimate by its slug.
   * @param slug - The estimate's slug.
   * @returns The details of the estimate.
   */
  async getBySlug(slug: string) {
    const query = estimateQueries.GET_ESTIMATE_BY_SLUG;
    const variables = { slug };
    const response = await this.client.query(query, variables);
    return response.data.estimateBySlug;
  }

  /**
   * Fetches multiple estimates by their slugs.
   * @param slugs - An array of estimate slugs.
   * @returns A list of estimates.
   */
  async getBySlugs(slugs: string[]) {
    const query = estimateQueries.GET_ESTIMATES_BY_SLUGS;
    const variables = { slugs };
    const response = await this.client.query(query, variables);
    return response.data.estimatesBySlugs;
  }
}
