import { organizationQueries } from '../../api/graphql/organization/queries.js';
import { organizationMutations } from '../../api/graphql/organization/mutations.js';
import { organizationMediaQueries } from '../../api/graphql/organization/queries.js';
import { organizationMediaMutations } from '../../api/graphql/organization/mutations.js';
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
    async list(pagination, sort, filter, admin) {
        const query = organizationQueries.GET_ORGANIZATIONS;
        const variables = { pagination, sort, filter, admin };
        const response = await this.client.query(query, variables);
        return response.organizations;
    }
    /**
     * Fetches a single organization by its ID.
     */
    async getById(organizationID, admin) {
        const query = organizationQueries.GET_ORGANIZATION_BY_ID;
        const variables = { organizationID, admin };
        const response = await this.client.query(query, variables);
        return response.organization;
    }
    /**
     * Fetches multiple organizations by their IDs.
     */
    async getByIds(organizationIDs, admin) {
        const query = organizationQueries.GET_ORGANIZATIONS_BY_IDS;
        const variables = { organizationIDs, admin };
        const response = await this.client.query(query, variables);
        return response.data.organizationsByIDs;
    }
    /**
     * Fetches a single organization by its unique reference.
     */
    async getByUniqRef(uniqRef, admin) {
        const query = organizationQueries.GET_ORGANIZATION_BY_UNIQ_REF;
        const variables = { uniqRef, admin };
        const response = await this.client.query(query, variables);
        return response.data.organizationByUniqRef;
    }
    /**
     * Fetches a single organization by its slug.
     */
    async getBySlug(slug, admin) {
        const query = organizationQueries.GET_ORGANIZATION_BY_SLUG;
        const variables = { slug, admin };
        const response = await this.client.query(query, variables);
        return response.organizationBySlug;
    }
    /**
     * Fetches multiple organizations by their slugs.
     */
    async getBySlugs(slugs, admin) {
        const query = organizationQueries.GET_ORGANIZATIONS_BY_SLUGS;
        const variables = { slugs, admin };
        const response = await this.client.query(query, variables);
        return response.data.organizationsBySlugs;
    }
    //========================== MUTATIONS =============================================================
    /**
     * Creates a new organization with the specified input.
     */
    async create(input) {
        const mutation = organizationMutations.CREATE_ORGANIZATION;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createOrganization;
    }
    /**
     * Updates an existing organization by its ID with the specified input.
     */
    async update(organizationID, input) {
        const mutation = organizationMutations.UPDATE_ORGANIZATION;
        const variables = { organizationID, input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateOrganization;
    }
    /**
     * Deletes an organization by its ID.
     */
    async delete(organizationID) {
        const mutation = organizationMutations.DELETE_ORGANIZATION;
        const variables = { organizationID };
        const response = await this.client.mutate(mutation, variables);
        return response.deleteOrganization;
    }
    //========================== MEDIA QUERIES =============================================================
    /**
     * Fetches a single organization media by its ID.
     */
    async getMediaById(organizationMediaID) {
        const query = organizationMediaQueries.GET_ORGANIZATION_MEDIA;
        const variables = { organizationMediaID };
        const response = await this.client.query(query, variables);
        return response.organizationMedia;
    }
    /**
     * Fetches all media for an organization.
     */
    async listMedias(organizationID) {
        const query = organizationMediaQueries.GET_ORGANIZATION_MEDIAS;
        const variables = { organizationID };
        const response = await this.client.query(query, variables);
        return response.organizationMedias;
    }
    //========================== MEDIA MUTATIONS =============================================================
    /**
     * Creates a new organization media.
     */
    async createMedia(input) {
        const mutation = organizationMediaMutations.CREATE_ORGANIZATION_MEDIA;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createOrganizationMedia;
    }
    /**
     * Updates an existing organization media.
     */
    async updateMedia(organizationMediaID, input) {
        const mutation = organizationMediaMutations.UPDATE_ORGANIZATION_MEDIA;
        const variables = { organizationMediaID, input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateOrganizationMedia;
    }
    /**
     * Deletes an organization media.
     */
    async deleteMedia(organizationMediaID) {
        const mutation = organizationMediaMutations.DELETE_ORGANIZATION_MEDIA;
        const variables = { organizationMediaID };
        const response = await this.client.mutate(mutation, variables);
        return response.deleteOrganizationMedia.success;
    }
}
