import { organizationQueries } from '../api/graphql/queries/organization/organizationQueries.js';
import { organizationMutations } from '../api/graphql/mutations/organization/organizationMutation.js';
import { organizationMediaQueries } from '../api/graphql/queries/organization/organizationMediaQueries.js';
import { organizationMediaMutations } from '../api/graphql/mutations/organization/organizationMediaMutations.js';
/**
 * The `Organization` class manages organization-related requests within the application.
 */
export class Organization {
    constructor(client) {
        this.client = client;
    }
    //========================== QUERIES =============================================================
    /**
     * Fetches a list of organizations with optional pagination, sorting, and filters.
     */
    async list(pagination, sort, filter) {
        const query = organizationQueries.GET_ORGANIZATIONS;
        const variables = { pagination, sort, filter };
        const response = await this.client.query(query, variables);
        return response.organizations;
    }
    /**
     * Fetches a single organization by its ID.
     */
    async getById(organizationID) {
        const query = organizationQueries.GET_ORGANIZATION_BY_ID;
        const variables = { organizationID };
        const response = await this.client.query(query, variables);
        return response.organization;
    }
    /**
     * Fetches multiple organizations by their IDs.
     */
    async getByIDs(organizationIDs) {
        const query = organizationQueries.GET_ORGANIZATIONS_BY_IDS;
        const variables = { organizationIDs };
        const response = await this.client.query(query, variables);
        return response.data.organizationsByIDs;
    }
    /**
     * Fetches a single organization by its unique reference.
     */
    async getByUniqRef(uniqRef) {
        const query = organizationQueries.GET_ORGANIZATION_BY_UNIQ_REF;
        const variables = { uniqRef };
        const response = await this.client.query(query, variables);
        return response.data.organizationByUniqRef;
    }
    /**
     * Fetches a single organization by its slug.
     */
    async getBySlug(slug) {
        const query = organizationQueries.GET_ORGANIZATION_BY_SLUG;
        const variables = { slug: slug };
        const response = await this.client.query(query, variables);
        return response.organizationBySlug;
    }
    /**
     * Fetches multiple organizations by their slugs.
     */
    async getBySlugs(slugs) {
        const query = organizationQueries.GET_ORGANIZATIONS_BY_SLUGS;
        const variables = { slugs };
        const response = await this.client.query(query, variables);
        return response.data.organizationsBySlugs;
    }
    //========================== MUTATIONS =============================================================
    /**
     * Creates a new organization with the specified input.
     */
    async createOrganization(input) {
        const mutation = organizationMutations.CREATE_ORGANIZATION;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createOrganization;
    }
    /**
     * Updates an existing organization by its ID with the specified input.
     */
    async updateOrganization(organizationID, input) {
        const mutation = organizationMutations.UPDATE_ORGANIZATION;
        const variables = { organizationID, input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateOrganization;
    }
    /**
     * Deletes an organization by its ID.
     */
    async deleteOrganization(organizationID) {
        const mutation = organizationMutations.DELETE_ORGANIZATION;
        const variables = { organizationID };
        const response = await this.client.mutate(mutation, variables);
        return response.deleteOrganization;
    }
    //========================== MEDIA QUERIES =============================================================
    /**
     * Fetches a single organization media by its ID.
     */
    async getOrganizationMedia(organizationMediaID) {
        const query = organizationMediaQueries.GET_ORGANIZATION_MEDIA;
        const variables = { organizationMediaID };
        const response = await this.client.query(query, variables);
        return response.organizationMedia;
    }
    /**
     * Fetches all media for an organization.
     */
    async getOrganizationMedias(organizationID) {
        const query = organizationMediaQueries.GET_ORGANIZATION_MEDIAS;
        const variables = { organizationID };
        const response = await this.client.query(query, variables);
        return response.organizationMedias;
    }
    //========================== MEDIA MUTATIONS =============================================================
    /**
     * Creates a new organization media.
     */
    async createOrganizationMedia(input) {
        const mutation = organizationMediaMutations.CREATE_ORGANIZATION_MEDIA;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createOrganizationMedia;
    }
    /**
     * Updates an existing organization media.
     */
    async updateOrganizationMedia(organizationMediaID, input) {
        const mutation = organizationMediaMutations.UPDATE_ORGANIZATION_MEDIA;
        const variables = { organizationMediaID, input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateOrganizationMedia;
    }
    /**
     * Deletes an organization media.
     */
    async deleteOrganizationMedia(organizationMediaID) {
        const mutation = organizationMediaMutations.DELETE_ORGANIZATION_MEDIA;
        const variables = { organizationMediaID };
        const response = await this.client.mutate(mutation, variables);
        return response.deleteOrganizationMedia.success;
    }
}
