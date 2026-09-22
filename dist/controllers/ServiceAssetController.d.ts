import { APIClient } from '../api/APIClient.js';
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
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
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
export declare class ServiceAsset {
    private client;
    constructor(client: APIClient);
    /**
     * Récupère un ServiceAsset par son ID.
     * @param serviceAssetID - L'identifiant du ServiceAsset.
     */
    get(serviceAssetID: string): Promise<ServiceAssetEntity>;
    /**
     * Récupère la liste de tous les ServiceAssets avec pagination, tri et filtres optionnels.
     */
    list(pagination?: any, sort?: any, filter?: any): Promise<ServiceAssetEntity[]>;
    /**
     * Récupère un ServiceAsset par son slug.
     * @param slug - Le slug du ServiceAsset.
     */
    getBySlug(slug: string): Promise<ServiceAssetEntity>;
    /**
     * Récupère plusieurs ServiceAssets par leurs IDs.
     * @param serviceAssetIDs - Tableau d'IDs de ServiceAssets.
     */
    getByIDs(serviceAssetIDs: string[]): Promise<ServiceAssetEntity[]>;
    /**
     * Récupère plusieurs ServiceAssets par leurs slugs.
     * @param slugs - Tableau de slugs de ServiceAssets.
     */
    getBySlugs(slugs: string[]): Promise<ServiceAssetEntity[]>;
    /**
     * Récupère un ServiceAsset par sa référence unique.
     * @param uniqRef - La référence unique du ServiceAsset.
     */
    getByUniqRef(uniqRef: string): Promise<ServiceAssetEntity>;
    /**
     * Crée un nouveau ServiceAsset.
     * @param input - Les données pour créer le ServiceAsset.
     */
    createServiceAsset(input: CreateServiceAssetInput): Promise<ServiceAssetEntity>;
    /**
     * Met à jour un ServiceAsset existant.
     * @param serviceAssetID - L'identifiant du ServiceAsset à mettre à jour.
     * @param input - Les données de mise à jour.
     */
    updateServiceAsset(serviceAssetID: string, input: UpdateServiceAssetInput): Promise<ServiceAssetEntity>;
    /**
     * Supprime un ServiceAsset.
     * @param serviceAssetID - L'identifiant du ServiceAsset à supprimer.
     */
    deleteServiceAsset(serviceAssetID: string): Promise<MutationResponse>;
    /**
     * Lie un Asset à un Service (Création d'un ServiceAsset).
     * @param serviceID - L'identifiant du Service.
     * @param assetID - L'identifiant de l'Asset (Option).
     * @param authorID - L'identifiant de l'auteur.
     */
    linkAssetToService(serviceID: string, assetID: string, authorID: string): Promise<ServiceAssetEntity>;
    /**
     * Délie un Asset d'un Service (Suppression du ServiceAsset).
     * @param serviceID - L'identifiant du Service.
     * @param assetID - L'identifiant de l'Asset (Option).
     */
    unlinkAssetFromService(serviceID: string, assetID: string): Promise<MutationResponse>;
}
