import { APIClient } from '../../api/APIClient.js';
import { serviceAssetQueries } from '../../api/graphql/catalog/queries.js';
import { serviceAssetMutations } from '../../api/graphql/catalog/mutations.js';

/**
 * Représente une entité ServiceAsset telle que définie dans le schéma GraphQL.
 */
export interface ServiceAssetEntity {
  serviceAssetID: string;
  uniqRef?: string;
  slug: string;
  assetID: string;
  serviceID: string;
  legend?: string;
  state: string; // ObjectStatus représenté ici comme string
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
  deletedAt?: string; // ISO8601
}

/** Filtre appliqué côté SDK par `ServiceAsset.list` (le service ne filtre pas). */
export interface ServiceAssetListOptions {
  filter?: { serviceID?: string; assetID?: string };
}

/**
 * Input pour la création d'un ServiceAsset.
 */
export interface CreateServiceAssetInput {
  assetID: string;
  serviceID: string;
  legend?: string;
  state: string;
}

/**
 * Input pour la mise à jour d'un ServiceAsset.
 */
export interface UpdateServiceAssetInput {
  assetID?: string;
  serviceID?: string;
  legend?: string;
  state?: string;
}

/**
 * Type de réponse pour les mutations (ex : suppression).
 */
export interface MutationResponse {
  success: boolean;
  message: string;
}

/**
 * ServiceAssetController gère les requêtes relatives aux ServiceAssets dans l'application.
 */
export class ServiceAsset {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  // ------------------------ QUERIES ------------------------

  /**
   * Récupère un ServiceAsset par son ID.
   * @param serviceAssetID - L'identifiant du ServiceAsset.
   */
  async getById(serviceAssetID: string): Promise<ServiceAssetEntity> {
    const query = serviceAssetQueries.GET_SERVICE_ASSET;
    const variables = { serviceAssetID };
    const response = await this.client.query(query, variables) as { serviceAsset: ServiceAssetEntity };
    return response.serviceAsset;
  }

  /**
   * Liste les ServiceAssets.
   *
   * `serviceAssets` (mu-catalog) n'accepte ni pagination, ni tri, ni filtre : le filtre
   * optionnel par `serviceID` / `assetID` est appliqué côté SDK. Pour les assets d'un
   * service avec leurs détails, préférer `catalog.asset.listByServiceId`.
   */
  async list(options?: ServiceAssetListOptions): Promise<ServiceAssetEntity[]> {
    const query = serviceAssetQueries.GET_SERVICE_ASSETS;
    const response = await this.client.query(query, {}) as { serviceAssets: ServiceAssetEntity[] | null };
    const rows = response?.serviceAssets ?? [];
    const { serviceID, assetID } = options?.filter ?? {};
    return rows.filter((row) =>
      (serviceID === undefined || row.serviceID === serviceID)
      && (assetID === undefined || row.assetID === assetID));
  }

  /**
   * Récupère un ServiceAsset par son slug.
   * @param slug - Le slug du ServiceAsset.
   */
  async getBySlug(slug: string): Promise<ServiceAssetEntity> {
    const query = serviceAssetQueries.GET_SERVICE_ASSET_BY_SLUG;
    const variables = { slug };
    const response = await this.client.query(query, variables) as { serviceAssetBySlug: ServiceAssetEntity };
    return response.serviceAssetBySlug;
  }

  /**
   * Récupère plusieurs ServiceAssets par leurs IDs.
   * @param serviceAssetIDs - Tableau d'IDs de ServiceAssets.
   */
  async getByIds(serviceAssetIDs: string[]): Promise<ServiceAssetEntity[]> {
    const query = serviceAssetQueries.GET_SERVICE_ASSETS_BY_IDS;
    const variables = { serviceAssetIDs };
    const response = await this.client.query(query, variables) as { serviceAssetsByIDs: ServiceAssetEntity[] };
    return response.serviceAssetsByIDs;
  }

  /**
   * Récupère plusieurs ServiceAssets par leurs slugs.
   * @param slugs - Tableau de slugs de ServiceAssets.
   */
  async getBySlugs(slugs: string[]): Promise<ServiceAssetEntity[]> {
    const query = serviceAssetQueries.GET_SERVICE_ASSETS_BY_SLUGS;
    const variables = { slugs };
    const response = await this.client.query(query, variables) as { serviceAssetsBySlugs: ServiceAssetEntity[] };
    return response.serviceAssetsBySlugs;
  }

  /**
   * Récupère un ServiceAsset par sa référence unique.
   * @param uniqRef - La référence unique du ServiceAsset.
   */
  async getByUniqRef(uniqRef: string): Promise<ServiceAssetEntity> {
    const query = serviceAssetQueries.GET_SERVICE_ASSET_BY_UNIQ_REF;
    const variables = { uniqRef };
    const response = await this.client.query(query, variables) as { serviceAssetByUniqRef: ServiceAssetEntity };
    return response.serviceAssetByUniqRef;
  }

  // ------------------------ MUTATIONS ------------------------

  /**
   * Crée un nouveau ServiceAsset.
   * @param input - Les données pour créer le ServiceAsset.
   */
  async create(input: CreateServiceAssetInput): Promise<ServiceAssetEntity> {
    const mutation = serviceAssetMutations.CREATE_SERVICE_ASSET;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { createServiceAsset: ServiceAssetEntity };
    return response.createServiceAsset;
  }

  /**
   * Met à jour un ServiceAsset existant.
   * @param serviceAssetID - L'identifiant du ServiceAsset à mettre à jour.
   * @param input - Les données de mise à jour.
   */
  async update(serviceAssetID: string, input: UpdateServiceAssetInput): Promise<ServiceAssetEntity> {
    const mutation = serviceAssetMutations.UPDATE_SERVICE_ASSET;
    const variables = { serviceAssetID, input };
    const response = await this.client.mutate(mutation, variables) as { updateServiceAsset: ServiceAssetEntity };
    return response.updateServiceAsset;
  }

  /**
   * Supprime un ServiceAsset.
   * @param serviceAssetID - L'identifiant du ServiceAsset à supprimer.
   */
  async delete(serviceAssetID: string): Promise<MutationResponse> {
    const mutation = serviceAssetMutations.DELETE_SERVICE_ASSET;
    const variables = { serviceAssetID };
    const response = await this.client.mutate(mutation, variables) as { deleteServiceAsset: MutationResponse };
    return response.deleteServiceAsset;
  }

  /**
   * Lie un Asset à un Service (Création d'un ServiceAsset).
   * @param serviceID - L'identifiant du Service.
   * @param assetID - L'identifiant de l'Asset (Option).
   * @param authorID - L'identifiant de l'auteur.
   */
  async linkAssetToService(serviceID: string, assetID: string, authorID: string): Promise<ServiceAssetEntity> {
    const mutation = serviceAssetMutations.LINK_ASSET_TO_SERVICE;
    const variables = { serviceID, assetID, authorID };
    const response = await this.client.mutate(mutation, variables) as { linkAssetToService: ServiceAssetEntity };
    return response.linkAssetToService;
  }

  /**
   * Délie un Asset d'un Service (Suppression du ServiceAsset).
   * @param serviceID - L'identifiant du Service.
   * @param assetID - L'identifiant de l'Asset (Option).
   */
  async unlinkAssetFromService(serviceID: string, assetID: string): Promise<MutationResponse> {
    const mutation = serviceAssetMutations.UNLINK_ASSET_FROM_SERVICE;
    const variables = { serviceID, assetID };
    const response = await this.client.mutate(mutation, variables) as { unlinkAssetFromService: MutationResponse };
    return response.unlinkAssetFromService;
  }
}
