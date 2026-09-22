import { serviceQueries } from '../api/graphql/queries/index.js';
import { serviceMutations } from '../api/graphql/mutations/catalog/serviceMutation.js';
import { serviceMediaQueries } from '../api/graphql/queries/catalog/serviceMediaQueries.js';
import { serviceMediaMutations } from '../api/graphql/mutations/catalog/serviceMediaMutation.js';
/**
 * `ServiceController` GÈRE LES REQUÊTES RELATIVES AUX SERVICES DANS L'APPLICATION.
 */
export class Service {
    constructor(client) {
        this.client = client;
    }
    //========================== QUERIES =============================================================
    async list(pagination, sort, filter) {
        const query = serviceQueries.GET_SERVICES;
        const variables = { pagination, sort, filter };
        const response = await this.client.query(query, variables);
        return response.services;
    }
    async getById(serviceID, admin) {
        const query = serviceQueries.GET_SERVICE_BY_ID;
        const variables = { serviceID, admin };
        const response = await this.client.query(query, variables);
        return response.service;
    }
    async getByAuthorID(authorID) {
        const query = serviceQueries.GET_SERVICE_BY_AUTHOR_ID;
        const variables = { authorID };
        const response = await this.client.query(query, variables);
        return response.servicesByUserId;
    }
    async getByUniqRef(uniqRef, admin) {
        const query = serviceQueries.GET_SERVICE_BY_UNIQ_REF;
        const variables = { uniqRef, admin };
        const response = await this.client.query(query, variables);
        return response.serviceByUniqRef;
    }
    async getBySlug(slug, admin) {
        const query = serviceQueries.GET_SERVICE_BY_SLUG;
        const variables = { slug, admin };
        const response = await this.client.query(query, variables);
        return response.data.serviceBySlug;
    }
    async getByIDs(serviceIDs, admin) {
        const query = serviceQueries.GET_SERVICES_BY_IDS;
        const variables = { serviceIDs, admin };
        const response = await this.client.query(query, variables);
        return response.servicesByIDs;
    }
    async getBySlugs(slugs, admin) {
        const query = serviceQueries.GET_SERVICES_BY_SLUGS;
        const variables = { slugs, admin };
        const response = await this.client.query(query, variables);
        return response.data.servicesBySlugs;
    }
    async listByOrganization(input) {
        const query = serviceQueries.LIST_SERVICES_BY_ORGANIZATION;
        const variables = { input };
        const response = await this.client.query(query, variables);
        return response.listServicesByOrganization;
    }
    async search(input) {
        const query = serviceQueries.SEARCH_SERVICES;
        const variables = { input };
        const response = await this.client.query(query, variables);
        return response.searchServices;
    }
    async getByAgentID(agentID) {
        const query = serviceQueries.GET_SERVICES_BY_AGENT_ID;
        const variables = { agentID };
        const response = await this.client.query(query, variables);
        return response.data.servicesByAgentID;
    }
    //========================== SERVICE MEDIA QUERIES ==============================================
    async getServiceMedia(serviceMediaID) {
        const query = serviceMediaQueries.GET_SERVICE_MEDIA;
        const variables = { serviceMediaID };
        const response = await this.client.query(query, variables);
        return response.serviceMedia;
    }
    async listServiceMedias(pagination, sort, filter) {
        const query = serviceMediaQueries.GET_SERVICE_MEDIAS;
        const variables = { pagination, sort, filter };
        const response = await this.client.query(query, variables);
        return response.serviceMedias;
    }
    async getServiceMediaBySlug(slug) {
        const query = serviceMediaQueries.GET_SERVICE_MEDIA_BY_SLUG;
        const variables = { slug };
        const response = await this.client.query(query, variables);
        return response.serviceMediaBySlug;
    }
    async getServiceMediasByIds(serviceMediaIDs) {
        const query = serviceMediaQueries.GET_SERVICE_MEDIAS_BY_IDS;
        const variables = { serviceMediaIDs };
        const response = await this.client.query(query, variables);
        return response.serviceMediasByIDs;
    }
    async getServiceMediasBySlugs(slugs) {
        const query = serviceMediaQueries.GET_SERVICE_MEDIAS_BY_SLUGS;
        const variables = { slugs };
        const response = await this.client.query(query, variables);
        return response.serviceMediasBySlugs;
    }
    async getServiceMediaByUniqRef(uniqRef) {
        const query = serviceMediaQueries.GET_SERVICE_MEDIA_BY_UNIQ_REF;
        const variables = { uniqRef };
        const response = await this.client.query(query, variables);
        return response.serviceMediaByUniqRef;
    }
    //========================== MUTATIONS =============================================================
    async createService(input) {
        const mutation = serviceMutations.CREATE_SERVICE;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createService;
    }
    async updateService(serviceID, input) {
        const mutation = serviceMutations.UPDATE_SERVICE;
        const variables = { serviceID, input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateService;
    }
    async deleteService(serviceID) {
        const mutation = serviceMutations.DELETE_SERVICE;
        const variables = { serviceID };
        const response = await this.client.mutate(mutation, variables);
        return response.deleteService;
    }
    /**
     * Publie un service ajouté aux favoris.
     * @param input - Objet contenant serviceID et optionnellement userID.
     */
    async addServiceToFavorites(input) {
        const mutation = serviceMutations.ADD_SERVICE_TO_FAVORITES;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.addServiceToFavorites;
    }
    //========================== SERVICE MEDIA MUTATIONS ==============================================
    async createServiceMedia(input) {
        const mutation = serviceMediaMutations.CREATE_SERVICE_MEDIA;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createServiceMedia;
    }
    async updateServiceMedia(serviceMediaID, input) {
        const mutation = serviceMediaMutations.UPDATE_SERVICE_MEDIA;
        const variables = { serviceMediaID, input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateServiceMedia;
    }
    async deleteServiceMedia(serviceMediaID) {
        const mutation = serviceMediaMutations.DELETE_SERVICE_MEDIA;
        const variables = { serviceMediaID };
        const response = await this.client.mutate(mutation, variables);
        return response.deleteServiceMedia;
    }
}
