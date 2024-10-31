// smp-sdk-ts/src/service/service.ts

import { SMPClient } from './../SMPClient';
import { serviceQueries } from './../api/graphql/queries/servicesQueries';

/**
 * Represents a filter input used for querying data.
 * 
 * @interface FilterInput
 * 
 * @property {string} field - The field to apply the filter on.
 * @property {string} value - The value to filter by.
 * @property {string} operator - The operator to use for filtering. 
 * Can be one of the following: "EQ" (equal), "NE" (not equal), "GT" (greater than), 
 * "GTE" (greater than or equal), "LT" (less than), "LTE" (less than or equal), 
 * "IN" (in array), "NIN" (not in array), "LIKE" (like pattern), "NLIKE" (not like pattern).
 */
interface FilterInput {
  field: String, 
  value: String, 
  operator: String, // "EQ", "NE", "GT", "GTE", "LT", "LTE", "IN", "NIN", "LIKE", "NLIKE"
}

interface SortInput  {
  field: String,
  order: String, // "ASC" or "DESC"
}

interface PaginationInput {
  limit: number,
  offset: number
}

export class Service {
  private client: SMPClient;

  constructor(client: SMPClient) {
    this.client = client;
  }

  async list(pagination: PaginationInput | undefined = undefined, sort: SortInput | undefined = undefined, filter: FilterInput[] | undefined = []) {
    console.log("Service.list() OK"); 
    const query = serviceQueries.GET_SERVICES;
    const variables = {
      pagination,
      sort,
      filter,
    };

    const response = await this.client.query(query, variables) as { data: { services: any } };
    return response.data.services;
  }

  async getById(serviceID: string) {
    const query = serviceQueries.GET_SERVICE_BY_ID;
    const variables = { serviceID };
    const response = await this.client.query(query, variables) as { data: { serviceByID: any } };
    return response.data.serviceByID;
  }

}
 