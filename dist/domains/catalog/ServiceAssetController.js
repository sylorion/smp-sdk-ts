import { serviceAssetQueries } from '../../api/graphql/catalog/queries.js';
import { serviceAssetMutations } from '../../api/graphql/catalog/mutations.js';
/**
 * ServiceAssetController gère les requêtes relatives aux ServiceAssets dans l'application.
 */
export class ServiceAsset {
    constructor(client) {
        this.client = client;
    }
    // ------------------------ QUERIES ------------------------
    /**
     * Récupère un ServiceAsset par son ID.
     * @param serviceAssetID - L'identifiant du ServiceAsset.
     */
    async getById(serviceAssetID) {
        const query = serviceAssetQueries.GET_SERVICE_ASSET;
        const variables = { serviceAssetID };
        const response = await this.client.query(query, variables);
        return response.serviceAsset;
    }
    /**
     * Récupère la liste de tous les ServiceAssets avec pagination, tri et filtres optionnels.
     */
    async list(pagination, sort, filter) {
        const query = serviceAssetQueries.GET_SERVICE_ASSETS;
        const variables = { pagination, sort, filter };
        const response = await this.client.query(query, variables);
        return response.serviceAssets;
    }
    /**
     * Récupère un ServiceAsset par son slug.
     * @param slug - Le slug du ServiceAsset.
     */
    async getBySlug(slug) {
        const query = serviceAssetQueries.GET_SERVICE_ASSET_BY_SLUG;
        const variables = { slug };
        const response = await this.client.query(query, variables);
        return response.serviceAssetBySlug;
    }
    /**
     * Récupère plusieurs ServiceAssets par leurs IDs.
     * @param serviceAssetIDs - Tableau d'IDs de ServiceAssets.
     */
    async getByIds(serviceAssetIDs) {
        const query = serviceAssetQueries.GET_SERVICE_ASSETS_BY_IDS;
        const variables = { serviceAssetIDs };
        const response = await this.client.query(query, variables);
        return response.serviceAssetsByIDs;
    }
    /**
     * Récupère plusieurs ServiceAssets par leurs slugs.
     * @param slugs - Tableau de slugs de ServiceAssets.
     */
    async getBySlugs(slugs) {
        const query = serviceAssetQueries.GET_SERVICE_ASSETS_BY_SLUGS;
        const variables = { slugs };
        const response = await this.client.query(query, variables);
        return response.serviceAssetsBySlugs;
    }
    /**
     * Récupère un ServiceAsset par sa référence unique.
     * @param uniqRef - La référence unique du ServiceAsset.
     */
    async getByUniqRef(uniqRef) {
        const query = serviceAssetQueries.GET_SERVICE_ASSET_BY_UNIQ_REF;
        const variables = { uniqRef };
        const response = await this.client.query(query, variables);
        return response.serviceAssetByUniqRef;
    }
    // ------------------------ MUTATIONS ------------------------
    /**
     * Crée un nouveau ServiceAsset.
     * @param input - Les données pour créer le ServiceAsset.
     */
    async create(input) {
        const mutation = serviceAssetMutations.CREATE_SERVICE_ASSET;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createServiceAsset;
    }
    /**
     * Met à jour un ServiceAsset existant.
     * @param serviceAssetID - L'identifiant du ServiceAsset à mettre à jour.
     * @param input - Les données de mise à jour.
     */
    async update(serviceAssetID, input) {
        const mutation = serviceAssetMutations.UPDATE_SERVICE_ASSET;
        const variables = { serviceAssetID, input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateServiceAsset;
    }
    /**
     * Supprime un ServiceAsset.
     * @param serviceAssetID - L'identifiant du ServiceAsset à supprimer.
     */
    async delete(serviceAssetID) {
        const mutation = serviceAssetMutations.DELETE_SERVICE_ASSET;
        const variables = { serviceAssetID };
        const response = await this.client.mutate(mutation, variables);
        return response.deleteServiceAsset;
    }
    /**
     * Lie un Asset à un Service (Création d'un ServiceAsset).
     * @param serviceID - L'identifiant du Service.
     * @param assetID - L'identifiant de l'Asset (Option).
     * @param authorID - L'identifiant de l'auteur.
     */
    async linkAssetToService(serviceID, assetID, authorID) {
        const mutation = serviceAssetMutations.LINK_ASSET_TO_SERVICE;
        const variables = { serviceID, assetID, authorID };
        const response = await this.client.mutate(mutation, variables);
        return response.linkAssetToService;
    }
    /**
     * Délie un Asset d'un Service (Suppression du ServiceAsset).
     * @param serviceID - L'identifiant du Service.
     * @param assetID - L'identifiant de l'Asset (Option).
     */
    async unlinkAssetFromService(serviceID, assetID) {
        const mutation = serviceAssetMutations.UNLINK_ASSET_FROM_SERVICE;
        const variables = { serviceID, assetID };
        const response = await this.client.mutate(mutation, variables);
        return response.unlinkAssetFromService;
    }
}
