// smp-sdk-ts/src/service/service.ts

import { APIClient } from '../api/APIClient';
import { serviceQueries } from '../api/graphql/queries/index'
/**
 * THE `Service` CLASS MANAGES SERVICE-RELATED REQUESTS WITHIN THE APPLICATION.
 * IT USES AN `APIClient` TO COMMUNICATE WITH THE GRAPHQL API AND PROVIDES VARIOUS METHODS TO FETCH, LIST, AND SEARCH SERVICES.
 * EACH METHOD USES A GRAPHQL QUERY DEFINED IN `serviceQueries`.
 */
export class Service {
  private client: APIClient;

  /**
   * INITIALIZES THE `Service` CLASS WITH AN `APIClient` FOR REQUESTS.
   * @param client - AN INSTANCE OF `APIClient` FOR GRAPHQL REQUESTS.
   */
  constructor(client: APIClient) {
    this.client = client;
  }

  /**
   * RETRIEVES A LIST OF SERVICES WITH OPTIONAL PAGINATION, SORTING, AND FILTERS.
   * @param pagination - PAGINATION PARAMETERS FOR THE REQUEST.
   * @param sort - SORTING PARAMETERS FOR THE SERVICES.
   * @param filter - FILTERS TO REFINE THE SERVICE LIST.
   * @returns A LIST OF SERVICES.
   */
  async list(pagination?: any, sort?: any, filter?: any) {
    console.log("Service.list()");
    const query = serviceQueries.GET_SERVICES;
    const variables = { pagination, sort, filter };
    const response = await this.client.query(query, variables) as { services: any } ;
    return response.services;
  }

  /**
   * FETCHES A SERVICE BY ITS UNIQUE ID.
   * @param serviceID - THE ID OF THE SERVICE TO RETRIEVE.
   * @returns THE DETAILS OF THE SERVICE.
   */
  async getById(serviceID: number) {
    const query = serviceQueries.GET_SERVICE_BY_ID;
    const variables = { serviceID };
    const response = await this.client.query(query, variables) as  { service: any } ;
    return response.service;
  }

  /**
   * FETCHES SERVICES BY THE AUTHOR'S ID.
   * @param authorID - THE ID OF THE AUTHOR.
   * @returns A LIST OF SERVICES ASSOCIATED WITH THE AUTHOR.
   */
  async getByAuthorID(authorID: string) {
    const query = serviceQueries.GET_SERVICE_BY_AUTHOR_ID;
    const variables = { authorID };
    const response = await this.client.query(query, variables) as  { servicesByUserId: any } ;
    return response.servicesByUserId;
  }

  /**
   * FETCHES A SERVICE BY ITS `uniqRef` (UNIQUE REFERENCE).
   * @param uniqRef - THE SERVICE'S UNIQUE REFERENCE.
   * @returns THE DETAILS OF THE SERVICE.
   */
  async getByUniqRef(uniqRef: string) {
    const query = serviceQueries.GET_SERVICE_BY_UNIQ_REF;
    const variables = { uniqRef };
    const response = await this.client.query(query, variables) as { data: { serviceByUniqRef: any } };
    return response.data.serviceByUniqRef;
  }

  /**
   * FETCHES A SERVICE BY ITS `slug`.
   * @param slug - THE SERVICE'S SLUG.
   * @returns THE DETAILS OF THE SERVICE.
   */
  async getBySlug(slug: string) {
    const query = serviceQueries.GET_SERVICE_BY_SLUG;
    const variables = { slug };
    const response = await this.client.query(query, variables) as { data: { serviceBySlug: any } };
    return response.data.serviceBySlug;
  }

  /**
   * FETCHES A LIST OF SERVICES BY THEIR `serviceIDs`.
   * @param serviceIDs - AN ARRAY OF SERVICE IDS.
   * @returns A LIST OF SERVICES.
   */
  async getByIDs(serviceIDs: string[]) {
    const query = serviceQueries.GET_SERVICES_BY_IDS;
    const variables = { serviceIDs };
    const response = await this.client.query(query, variables) as { data: { servicesByIDs: any } };
    return response.data.servicesByIDs;
  }

  /**
   * FETCHES A LIST OF SERVICES BY THEIR `slugs`.
   * @param slugs - AN ARRAY OF SERVICE SLUGS.
   * @returns A LIST OF SERVICES.
   */
  async getBySlugs(slugs: string[]) {
    const query = serviceQueries.GET_SERVICES_BY_SLUGS;
    const variables = { slugs };
    const response = await this.client.query(query, variables) as { data: { servicesBySlugs: any } };
    return response.data.servicesBySlugs;
  }

  /**
   * FETCHES A LIST OF SERVICES ASSOCIATED WITH A SPECIFIC ORGANIZATION.
   * @param input - INPUT PARAMETERS TO LIST SERVICES BY ORGANIZATION.
   * @returns A LIST OF SERVICES ASSOCIATED WITH THE ORGANIZATION.
   */
  async listByOrganization(input: any) {
    const query = serviceQueries.LIST_SERVICES_BY_ORGANIZATION;
    const variables = { input };
    const response = await this.client.query(query, variables) as { data: { listServicesByOrganization: any } };
    return response.data.listServicesByOrganization;
  }

  /**
   * SEARCHES FOR SERVICES BASED ON SPECIFIED CRITERIA (STRING: TITLE, SUBTITLE, AND DESCRIPTION).
   * @param input - SEARCH PARAMETERS.
   * @returns A LIST OF SERVICES THAT MATCH THE SEARCH CRITERIA.
   */
  async search(input: string) {
    const query = serviceQueries.SEARCH_SERVICES;
    const variables = { input };
    const response = await this.client.query(query, variables) as { data: { searchServices: any } };
    return response.data.searchServices;
  }
}
