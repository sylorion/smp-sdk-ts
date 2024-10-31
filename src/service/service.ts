// smp-sdk-ts/src/controllers/serviceController.ts

import { QueriesBuilder } from '../api/graphql/queriesBuilder';
import { serviceQueries } from '../api/graphql/queries/servicesQueries';

export class Service {
  private queryBuilder: QueriesBuilder;

  constructor(queryBuilder: QueriesBuilder) {
    this.queryBuilder = queryBuilder;
  }

  async list(pagination?: any, sort?: any, filter?: any) {
    return await this.queryBuilder.list(serviceQueries.GET_SERVICES, pagination, sort, filter);
  }

  async getById(serviceID: string) {
    return await this.queryBuilder.getById(serviceQueries.GET_SERVICE_BY_ID, serviceID);
  }

  async getByIDs(serviceIDs: string[]) {
    return await this.queryBuilder.getByIDs(serviceQueries.GET_SERVICES_BY_IDS, serviceIDs);
  }

  async getByUniqRef(uniqRef: string) {
    return await this.queryBuilder.getByUniqRef(serviceQueries.GET_SERVICE_BY_UNIQ_REF, uniqRef);
  }

  async getBySlug(slug: string) {
    return await this.queryBuilder.getBySlug(serviceQueries.GET_SERVICE_BY_SLUG, slug);
  }

  async getBySlugs(slugs: string[]) {
    return await this.queryBuilder.getBySlugs(serviceQueries.GET_SERVICES_BY_SLUGS, slugs);
  }

  async listByOrganization(input: any) {
    const variables = { input };
    const response = await this.queryBuilder.client.query(serviceQueries.LIST_SERVICES_BY_ORGANIZATION, variables);
    return response.data.listServicesByOrganization;
  }

  async search(input: any) {
    const variables = { input };
    const response = await this.queryBuilder.client.query(serviceQueries.SEARCH_SERVICES, variables);
    return response.data.searchServices;
  }
}


