import { APIClient } from '../api/APIClient';
import { assetQueries } from '../api/graphql/queries/catalog/assetQueries';
import { assetMutations } from '../api/graphql/mutations/catalog/assetMutations';

/**
 * Type représentant un Asset tel que défini dans le schéma GraphQL.
 */
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
  conflictingAssets?: string;
  applyableAssets?: string;
  state: string; // ObjectStatus (ici représenté par une chaîne de caractères)
  createdAt: string; // DateTime au format ISO8601
  updatedAt: string; // DateTime au format ISO8601
  deletedAt?: string; // DateTime au format ISO8601
}

/**
 * Input pour la création d'un Asset.
 */
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
  conflictingAssets?: string;
  applyableAssets?: string;
  state: string;
}

/**
 * Input pour la mise à jour d'un Asset.
 */
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

/**
 * Réponse type pour une mutation (ex : suppression d'un asset).
 */
export interface MutationResponse {
  success: boolean;
  message: string;
}

/**
 * AssetController gère les requêtes relatives aux assets dans l'application.
 */
export class AssetController {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  // ------------------------ QUERIES ------------------------

  /**
   * Récupère un asset via son ID.
   * @param assetID - L'identifiant de l'asset.
   */
  async get(assetID: string): Promise<AssetEntity> {
    const query = assetQueries.GET_ASSET; // Doit correspondre à la query "asset(assetID: ID!): Asset"
    const variables = { assetID };
    const response = await this.client.query(query, variables) as { data: { asset: AssetEntity } };
    return response.data.asset;
  }

  /**
   * Récupère la liste de tous les assets.
   * @param pagination - (Optionnel) Paramètres de pagination.
   * @param sort - (Optionnel) Critères de tri.
   * @param filter - (Optionnel) Filtres.
   */
  async list(pagination?: any, sort?: any, filter?: any): Promise<AssetEntity[]> {
    const query = assetQueries.GET_ASSETS; // Doit correspondre à la query "assets(pagination:..., sort:..., filter:...): [Asset!]!"
    const variables = { pagination, sort, filter };
    const response = await this.client.query(query, variables) as { data: { assets: AssetEntity[] } };
    return response.data.assets;
  }

  /**
   * Récupère un asset via son slug.
   * @param slug - Le slug de l'asset.
   */
  async assetBySlug(slug: string): Promise<AssetEntity> {
    const query = assetQueries.GET_ASSET_BY_SLUG;
    const variables = { slug };
    const response = await this.client.query(query, variables) as { data: { assetBySlug: AssetEntity } };
    return response.data.assetBySlug;
  }

  /**
   * Récupère plusieurs assets via leurs IDs.
   * @param assetIDs - Tableau d'IDs d'assets.
   */
  async assetsByIDs(assetIDs: string[]): Promise<AssetEntity[]> {
    const query = assetQueries.GET_ASSETS_BY_IDS;
    const variables = { assetIDs };
    const response = await this.client.query(query, variables) as { data: { assetsByIDs: AssetEntity[] } };
    return response.data.assetsByIDs;
  }

  /**
   * Récupère plusieurs assets via leurs slugs.
   * @param slugs - Tableau de slugs d'assets.
   */
  async assetsBySlugs(slugs: string[]): Promise<AssetEntity[]> {
    const query = assetQueries.GET_ASSETS_BY_SLUGS;
    const variables = { slugs };
    const response = await this.client.query(query, variables) as { data: { assetsBySlugs: AssetEntity[] } };
    return response.data.assetsBySlugs;
  }

  /**
   * Récupère un asset via son uniqRef.
   * @param uniqRef - La référence unique de l'asset.
   */
  async assetByUniqRef(uniqRef: string): Promise<AssetEntity> {
    const query = assetQueries.GET_ASSET_BY_UNIQ_REF;
    const variables = { uniqRef };
    const response = await this.client.query(query, variables) as { data: { assetByUniqRef: AssetEntity } };
    return response.data.assetByUniqRef;
  }

  // ------------------------ MUTATIONS ------------------------

  /**
   * Crée un nouvel asset.
   * @param input - Les données nécessaires à la création de l'asset.
   */
  async createAsset(input: CreateAssetInput): Promise<AssetEntity> {
    const mutation = assetMutations.CREATE_ASSET;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { data: { createAsset: AssetEntity } };
    return response.data.createAsset;
  }

  /**
   * Met à jour un asset existant.
   * @param assetID - L'identifiant de l'asset à mettre à jour.
   * @param input - Les données de mise à jour.
   */
  async updateAsset(assetID: string, input: UpdateAssetInput): Promise<AssetEntity> {
    const mutation = assetMutations.UPDATE_ASSET;
    const variables = { assetID, input };
    const response = await this.client.mutate(mutation, variables) as { data: { updateAsset: AssetEntity } };
    return response.data.updateAsset;
  }

  /**
   * Supprime un asset.
   * @param assetID - L'identifiant de l'asset à supprimer.
   */
  async deleteAsset(assetID: string): Promise<MutationResponse> {
    const mutation = assetMutations.DELETE_ASSET;
    const variables = { assetID };
    const response = await this.client.mutate(mutation, variables) as { data: { deleteAsset: MutationResponse } };
    return response.data.deleteAsset;
  }
}
