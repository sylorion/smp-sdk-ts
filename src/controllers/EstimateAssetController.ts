// smp-sdk-ts/src/estimateAsset/estimateAsset.ts

import { APIClient } from '../api/APIClient';
import { estimateAssetQueries } from '../api/graphql/queries/accounting/estimateAssetQueries';

/**
 * The `EstimateAsset` class handles estimate asset-related requests within the application.
 */
export   class EstimateAsset {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  async list(pagination?: any, sort?: any, filter?: any) {
    const query = estimateAssetQueries.GET_ESTIMATE_ASSETS;
    const variables = { pagination, sort, filter };
    const response = await this.client.query(query, variables);
    return response.data.estimateAssets;
  }

  async getById(estimateAssetID: string) {
    const query = estimateAssetQueries.GET_ESTIMATE_ASSET_BY_ID;
    const variables = { estimateAssetID };
    const response = await this.client.query(query, variables);
    return response.data.estimateAssetByID;
  }

  async getByIDs(estimateAssetIDs: string[]) {
    const query = estimateAssetQueries.GET_ESTIMATE_ASSETS_BY_IDS;
    const variables = { estimateAssetIDs };
    const response = await this.client.query(query, variables);
    return response.data.estimateAssetsByIDs;
  }

  async getByUniqRef(uniqRef: string) {
    const query = estimateAssetQueries.GET_ESTIMATE_ASSET_BY_UNIQ_REF;
    const variables = { uniqRef };
    const response = await this.client.query(query, variables);
    return response.data.estimateAssetByUniqRef;
  }

  async getBySlug(slug: string) {
    const query = estimateAssetQueries.GET_ESTIMATE_ASSET_BY_SLUG;
    const variables = { slug };
    const response = await this.client.query(query, variables);
    return response.data.estimateAssetBySlug;
  }

  async getBySlugs(slugs: string[]) {
    const query = estimateAssetQueries.GET_ESTIMATE_ASSETS_BY_SLUGS;
    const variables = { slugs };
    const response = await this.client.query(query, variables);
    return response.data.estimateAssetsBySlugs;
  }
}
