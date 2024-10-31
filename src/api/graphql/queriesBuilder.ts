// smp-sdk-ts/src/api/queriesBuilder.ts

import { APIClient } from './../APIClient';

export class QueriesBuilder {
  public client: APIClient;  // Type défini comme APIClient pour des requêtes HTTP et GraphQL

  constructor(client: APIClient) {
    this.client = client;
  }

  async list(entityQuery: string, pagination?: any, sort?: any, filter?: any) {
    const variables = { pagination, sort, filter };
    const response = await this.client.query(entityQuery, variables);
    return response.data;
  }

  async getById(entityQuery: string, id: string) {
    const variables = { id };
    const response = await this.client.query(entityQuery, variables);
    return response.data;
  }

  async getByIDs(entityQuery: string, ids: string[]) {
    const variables = { ids };
    const response = await this.client.query(entityQuery, variables);
    return response.data;
  }

  async getByUniqRef(entityQuery: string, uniqRef: string) {
    const variables = { uniqRef };
    const response = await this.client.query(entityQuery, variables);
    return response.data;
  }

  async getBySlug(entityQuery: string, slug: string) {
    const variables = { slug };
    const response = await this.client.query(entityQuery, variables);
    return response.data;
  }

  async getBySlugs(entityQuery: string, slugs: string[]) {
    const variables = { slugs };
    const response = await this.client.query(entityQuery, variables);
    return response.data;
  }
}
