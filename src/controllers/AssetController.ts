import { APIClient } from '../api/APIClient';
import { assetQueries } from '../api/graphql/queries/catalog/assetQueries';
import { assetMutations } from '../api/graphql/mutations/catalog/assetMutations';

// --- Entity Interfaces ---
export interface AssetEntity {
  assetID: string;
  uniqRef?: string;
  slug?: string;
  title: string;
  authorID?: string;
  organizationID?: string;
  mediaID?: string;
  description?: string;
  price: number;
  legalVatPercent?: number;
  quantity: number;
  stockQuantity?: number;
  maxPerReservation?: number;
  conflictingAssets?: JSON;
  applyableAssets?: JSON;
  state: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ServiceAssetPayloadEntity {
  serviceAssetID: string;
  serviceID: string;
  assetID: string;
}

export interface AssetWithServiceAssetEntity {
  asset: AssetEntity;
  serviceAsset: ServiceAssetPayloadEntity;
}

export interface ServiceWithServiceAssetEntity {
  service: { serviceID: string; name?: string; organizationID?: string };
  serviceAsset: ServiceAssetPayloadEntity;
}

export interface AssetWithLinksEntity {
  asset: AssetEntity;
  serviceLinks: ServiceWithServiceAssetEntity[];
}

export interface CreateAssetInput {
  title: string;
  stockQuantity?: number;
  organizationID?: string;
  mediaID?: string;
  description?: string;
  price: number;
  legalVatPercent?: number;
  quantity: number;
  maxPerReservation?: number;
  conflictingAssets?: JSON;
  applyableAssets?: JSON;
  state: string;
}

export interface UpdateAssetInput {
  title?: string;
  stockQuantity?: number;
  mediaID?: string;
  description?: string;
  price?: number;
  legalVatPercent?: number;
  quantity?: number;
  maxPerReservation?: number;
  conflictingAssets?: string;
  applyableAssets?: string;
  state?: string;
}

export interface ListAssetsByServiceInput {
  serviceID: string;
}

export interface ListServicesByAssetInput {
  assetID: string;
}

export interface ListAssetsByOrganizationInput {
  organizationID: string;
}

export interface MutationResponse {
  success: boolean;
  message: string;
}

/**
 * AssetController gère les requêtes relatives aux assets dans l'application.
 */
export class Asset {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  // ------------------------ QUERIES ------------------------

  async get(assetID: string): Promise<AssetEntity> {
    const query = assetQueries.GET_ASSET;
    const variables = { assetID };
    const response = await this.client.query<{ asset: AssetEntity }>(query, variables);
    return response.asset;
  }

  async list(
    pagination?: any,
    sort?: any,
    filter?: any
  ): Promise<AssetEntity[]> {
    const query = assetQueries.GET_ASSETS;
    const variables = { pagination, sort, filter };
    const response = await this.client.query<{ assets: AssetEntity[] }>(query, variables);
    return response.assets;
  }

  async assetBySlug(slug: string): Promise<AssetEntity> {
    const query = assetQueries.GET_ASSET_BY_SLUG;
    const variables = { slug };
    const response = await this.client.query<{ assetBySlug: AssetEntity }>(query, variables);
    return response.assetBySlug;
  }

  async assetsByIDs(assetIDs: string[]): Promise<AssetEntity[]> {
    const query = assetQueries.GET_ASSETS_BY_IDS;
    const variables = { assetIDs };
    const response = await this.client.query<{ assetsByIDs: AssetEntity[] }>(query, variables);
    return response.assetsByIDs;
  }

  async assetsBySlugs(slugs: string[]): Promise<AssetEntity[]> {
    const query = assetQueries.GET_ASSETS_BY_SLUGS;
    const variables = { slugs };
    const response = await this.client.query<{ assetsBySlugs: AssetEntity[] }>(query, variables);
    return response.assetsBySlugs;
  }

  async assetByUniqRef(uniqRef: string): Promise<AssetEntity> {
    const query = assetQueries.GET_ASSET_BY_UNIQ_REF;
    const variables = { uniqRef };
    const response = await this.client.query<{ assetByUniqRef: AssetEntity }>(query, variables);
    return response.assetByUniqRef;
  }

  /**
   * Récupère la liste des Assets associés à un service, avec pivot.
   */
  async listByService(
    input: ListAssetsByServiceInput
  ): Promise<AssetWithServiceAssetEntity[]> {
    const query = assetQueries.LIST_ASSETS_BY_SERVICE;
    const variables = { input };
    const response = await this.client.query<{
      listAssetsByService: AssetWithServiceAssetEntity[];
    }>(query, variables);
    return response.listAssetsByService;
  }

  /**
   * Récupère la liste des Services associés à un asset, avec pivot.
   */
  async listServicesByAsset(
    input: ListServicesByAssetInput
  ): Promise<ServiceWithServiceAssetEntity[]> {
    const query = assetQueries.LIST_SERVICES_BY_ASSET;
    const variables = { input };
    const response = await this.client.query<{
      listServicesByAsset: ServiceWithServiceAssetEntity[];
    }>(query, variables);
    return response.listServicesByAsset;
  }

  /**
   * Récupère la liste des Assets d'une organisation, avec tous leurs pivots.
   */
  async listByOrganization(
    input: ListAssetsByOrganizationInput
  ): Promise<AssetWithLinksEntity[]> {
    const query = assetQueries.LIST_ASSETS_BY_ORGANIZATION;
    const variables = { input };
    const response = await this.client.query<{
      listAssetsByOrganization: AssetWithLinksEntity[];
    }>(query, variables);
    return response.listAssetsByOrganization;
  }

  // ------------------------ MUTATIONS ------------------------

  async createAsset(
    input: CreateAssetInput
  ): Promise<AssetEntity> {
    const mutation = assetMutations.CREATE_ASSET;
    const variables = { input };
    const response = await this.client.mutate<{
      createAsset: AssetEntity;
    }>(mutation, variables);
    return response.createAsset;
  }

  async updateAsset(
    assetID: string,
    input: UpdateAssetInput
  ): Promise<AssetEntity> {
    const mutation = assetMutations.UPDATE_ASSET;
    const variables = { assetID, input };
    const response = await this.client.mutate<{
      updateAsset: AssetEntity;
    }>(mutation, variables);
    return response.updateAsset;
  }

  async deleteAsset(assetID: string): Promise<MutationResponse> {
    const mutation = assetMutations.DELETE_ASSET;
    const variables = { assetID };
    const response = await this.client.mutate<{
      deleteAsset: MutationResponse;
    }>(mutation, variables);
    return response.deleteAsset;
  }
}
