// smp-sdk-ts/src/service/service.ts

import { SMPClient } from './../SMPClient';
import { serviceQueries } from './../api/graphql/queries/servicesQueries';

export class Service {
  private client: SMPClient;

  constructor(client: SMPClient) {
    this.client = client;
  }

  async list(pagination?: any, sort?: any, filter?: any) {
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
 