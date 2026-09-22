import { assetQueries } from '../api/graphql/queries/catalog/assetQueries.js';
import { assetMutations } from '../api/graphql/mutations/catalog/assetMutations.js';
import { assetMediaQueries } from '../api/graphql/queries/catalog/assetMediaQueries.js';
import { assetMediaMutations } from '../api/graphql/mutations/catalog/assetMediaMutations.js';
/**
 * AssetController gère les requêtes relatives aux assets dans l'application.
 */
export class Asset {
    constructor(client) {
        this.client = client;
    }
    // ------------------------ QUERIES ------------------------
    async get(assetID) {
        const query = assetQueries.GET_ASSET;
        const variables = { assetID };
        const response = await this.client.query(query, variables);
        return response.asset;
    }
    async list(pagination, sort, filter) {
        const query = assetQueries.GET_ASSETS;
        const variables = { pagination, sort, filter };
        const response = await this.client.query(query, variables);
        return response.assets;
    }
    async assetBySlug(slug) {
        const query = assetQueries.GET_ASSET_BY_SLUG;
        const variables = { slug };
        const response = await this.client.query(query, variables);
        return response.assetBySlug;
    }
    async assetsByIDs(assetIDs) {
        const query = assetQueries.GET_ASSETS_BY_IDS;
        const variables = { assetIDs };
        const response = await this.client.query(query, variables);
        return response.assetsByIDs;
    }
    async assetsBySlugs(slugs) {
        const query = assetQueries.GET_ASSETS_BY_SLUGS;
        const variables = { slugs };
        const response = await this.client.query(query, variables);
        return response.assetsBySlugs;
    }
    async assetByUniqRef(uniqRef) {
        const query = assetQueries.GET_ASSET_BY_UNIQ_REF;
        const variables = { uniqRef };
        const response = await this.client.query(query, variables);
        return response.assetByUniqRef;
    }
    /**
     * Récupère la liste des Assets associés à un service, avec pivot.
     */
    async listByService(input) {
        const query = assetQueries.LIST_ASSETS_BY_SERVICE;
        const variables = { input };
        const response = await this.client.query(query, variables);
        return response.listAssetsByService;
    }
    /**
     * Récupère la liste des Services associés à un asset, avec pivot.
     */
    async listServicesByAsset(input) {
        const query = assetQueries.LIST_SERVICES_BY_ASSET;
        const variables = { input };
        const response = await this.client.query(query, variables);
        return response.listServicesByAsset;
    }
    /**
     * Récupère la liste des Assets d'une organisation, avec tous leurs pivots.
     */
    async listByOrganization(input) {
        const query = assetQueries.LIST_ASSETS_BY_ORGANIZATION;
        const variables = { input };
        const response = await this.client.query(query, variables);
        return response.listAssetsByOrganization;
    }
    // ------------------------ MUTATIONS ------------------------
    async createAsset(input) {
        const mutation = assetMutations.CREATE_ASSET;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createAsset;
    }
    async updateAsset(assetID, input) {
        const mutation = assetMutations.UPDATE_ASSET;
        const variables = { assetID, input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateAsset;
    }
    async deleteAsset(assetID) {
        const mutation = assetMutations.DELETE_ASSET;
        const variables = { assetID };
        const response = await this.client.mutate(mutation, variables);
        return response.deleteAsset;
    }
    // ------------------------ ASSET MEDIA QUERIES ------------------------
    async getAssetMedia(assetMediaID) {
        const query = assetMediaQueries.GET_ASSET_MEDIA;
        const variables = { assetMediaID };
        const response = await this.client.query(query, variables);
        return response.assetMedia;
    }
    async listAssetMedias(pagination, sort, filter) {
        const query = assetMediaQueries.GET_ASSET_MEDIAS;
        const variables = { pagination, sort, filter };
        const response = await this.client.query(query, variables);
        return response.assetMedias;
    }
    async assetMediasByIDs(assetMediaIDs) {
        const query = assetMediaQueries.GET_ASSET_MEDIAS_BY_IDS;
        const variables = { assetMediaIDs };
        const response = await this.client.query(query, variables);
        return response.assetMediasByIDs;
    }
    // ------------------------ ASSET MEDIA MUTATIONS ------------------------
    async createAssetMedia(input) {
        const mutation = assetMediaMutations.CREATE_ASSET_MEDIA;
        const response = await this.client.mutate(mutation, { input });
        return response.createAssetMedia;
    }
    async updateAssetMedia(assetMediaID, input) {
        const mutation = assetMediaMutations.UPDATE_ASSET_MEDIA;
        const response = await this.client.mutate(mutation, { assetMediaID, input });
        return response.updateAssetMedia;
    }
    async deleteAssetMedia(assetMediaID) {
        const mutation = assetMediaMutations.DELETE_ASSET_MEDIA;
        const response = await this.client.mutate(mutation, { assetMediaID });
        return response.deleteAssetMedia;
    }
}
