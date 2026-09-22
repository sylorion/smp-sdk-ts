import { assetQueries } from '../../api/graphql/catalog/queries.js';
import { assetMutations } from '../../api/graphql/catalog/mutations.js';
import { assetMediaQueries } from '../../api/graphql/catalog/queries.js';
import { assetMediaMutations } from '../../api/graphql/catalog/mutations.js';
/**
 * AssetController gère les requêtes relatives aux assets dans l'application.
 */
export class Asset {
    constructor(client) {
        this.client = client;
    }
    // ------------------------ QUERIES ------------------------
    async getById(assetID, admin) {
        const query = assetQueries.GET_ASSET;
        const variables = { assetID, admin };
        const response = await this.client.query(query, variables);
        return response.asset;
    }
    async list(pagination, sort, filter, admin) {
        const query = assetQueries.GET_ASSETS;
        // Gateway only supports `admin` arg on Query.assets — no pagination/sort/filter
        const variables = { admin };
        const response = await this.client.query(query, variables);
        return response.assets;
    }
    async getBySlug(slug, admin) {
        const query = assetQueries.GET_ASSET_BY_SLUG;
        const variables = { slug, admin };
        const response = await this.client.query(query, variables);
        return response.assetBySlug;
    }
    async getByIds(assetIDs, admin) {
        const query = assetQueries.GET_ASSETS_BY_IDS;
        const variables = { assetIDs, admin };
        const response = await this.client.query(query, variables);
        return response.assetsByIDs;
    }
    async getBySlugs(slugs, admin) {
        const query = assetQueries.GET_ASSETS_BY_SLUGS;
        const variables = { slugs, admin };
        const response = await this.client.query(query, variables);
        return response.assetsBySlugs;
    }
    async getByUniqRef(uniqRef, admin) {
        const query = assetQueries.GET_ASSET_BY_UNIQ_REF;
        const variables = { uniqRef, admin };
        const response = await this.client.query(query, variables);
        return response.assetByUniqRef;
    }
    /**
     * Récupère la liste des Assets associés à un service, avec pivot.
     */
    async listByServiceId(serviceID) {
        const query = assetQueries.LIST_ASSETS_BY_SERVICE;
        const variables = { input: { serviceID } };
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
    async listByOrganizationId(organizationID, admin) {
        const query = assetQueries.LIST_ASSETS_BY_ORGANIZATION;
        const variables = { input: { organizationID, admin } };
        const response = await this.client.query(query, variables);
        return response.listAssetsByOrganization;
    }
    // ------------------------ MUTATIONS ------------------------
    async create(input) {
        const mutation = assetMutations.CREATE_ASSET;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createAsset;
    }
    async update(assetID, input) {
        const mutation = assetMutations.UPDATE_ASSET;
        const variables = { assetID, input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateAsset;
    }
    async delete(assetID) {
        const mutation = assetMutations.DELETE_ASSET;
        const variables = { assetID };
        const response = await this.client.mutate(mutation, variables);
        return response.deleteAsset;
    }
    // ------------------------ ASSET MEDIA QUERIES ------------------------
    async getMediaById(assetMediaID) {
        const query = assetMediaQueries.GET_ASSET_MEDIA;
        const variables = { assetMediaID };
        const response = await this.client.query(query, variables);
        return response.assetMedia;
    }
    async listMedias(pagination, sort, filter) {
        const query = assetMediaQueries.GET_ASSET_MEDIAS;
        const variables = { pagination, sort, filter };
        const response = await this.client.query(query, variables);
        return response.assetMedias;
    }
    async getMediasByIds(assetMediaIDs) {
        const query = assetMediaQueries.GET_ASSET_MEDIAS_BY_IDS;
        const variables = { assetMediaIDs };
        const response = await this.client.query(query, variables);
        return response.assetMediasByIDs;
    }
    // ------------------------ ASSET MEDIA MUTATIONS ------------------------
    async createMedia(input) {
        const mutation = assetMediaMutations.CREATE_ASSET_MEDIA;
        const response = await this.client.mutate(mutation, { input });
        return response.createAssetMedia;
    }
    async updateMedia(assetMediaID, input) {
        const mutation = assetMediaMutations.UPDATE_ASSET_MEDIA;
        const response = await this.client.mutate(mutation, { assetMediaID, input });
        return response.updateAssetMedia;
    }
    async deleteMedia(assetMediaID) {
        const mutation = assetMediaMutations.DELETE_ASSET_MEDIA;
        const response = await this.client.mutate(mutation, { assetMediaID });
        return response.deleteAssetMedia;
    }
}
