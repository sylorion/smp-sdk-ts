// smp-sdk-ts/src/estimate/estimate.ts
import { estimateQueries } from '../api/graphql/queries/accounting/estimateQueries.js';
/**
 * The `Estimate` class manages estimate-related requests within the application.
 * Provides methods to retrieve, list, and search estimates.
 */
export class Estimate {
    constructor(client) {
        this.client = client;
    }
    /**
     * Creates a new estimate
     */
    async create(data) {
        const query = estimateQueries.CREATE_ESTIMATE;
        const response = await this.client.mutate(query, { data });
        return response.createEstimate;
    }
    /**
     * Updates an existing estimate
     */
    async update(id, data) {
        const query = estimateQueries.UPDATE_ESTIMATE;
        const response = await this.client.mutate(query, {
            estimateId: { estimateId: id },
            updateEstimateInput: {
                estimateId: id,
                ...data
            }
        });
        return response.updateEstimate;
    }
    /**
     * Validates an estimate
     */
    async validate(data) {
        const query = estimateQueries.VALIDATE_ESTIMATE;
        const response = await this.client.mutate(query, { data });
        return response.validateEstimate;
    }
    /**
     * Retrieves an estimate by its ID
     */
    async getById(estimateId) {
        const query = estimateQueries.GET_ESTIMATE_BY_ID;
        const response = await this.client.query(query, { estimateId });
        return response.estimate;
    }
    /**
     * Retrieves a list of estimates with optional pagination, sorting, and filters.
     */
    async list(pagination, sort, filter) {
        const query = estimateQueries.GET_ESTIMATES;
        const variables = { pagination, sort, filter };
        const response = await this.client.query(query, variables);
        return response.estimates;
    }
    /**
     * Fetches multiple estimates by an array of estimate IDs.
     */
    async getByIDs(estimateIDs) {
        const query = estimateQueries.GET_ESTIMATES_BY_IDS;
        const variables = { estimateIDs };
        const response = await this.client.query(query, variables);
        return response.data.estimatesByIDs;
    }
    /**
     * Fetches an estimate by its unique reference (`uniqRef`).
     */
    async getByUniqRef(uniqRef) {
        const query = estimateQueries.GET_ESTIMATE_BY_UNIQ_REF;
        const variables = { uniqRef };
        const response = await this.client.query(query, variables);
        return response.data.estimateByUniqRef;
    }
    /**
     * Fetches an estimate by its slug.
     */
    async getBySlug(slug) {
        const query = estimateQueries.GET_ESTIMATE_BY_SLUG;
        const variables = { slug };
        const response = await this.client.query(query, variables);
        return response.data.estimateBySlug;
    }
    /**
     * Fetches multiple estimates by their slugs.
     */
    async getBySlugs(slugs) {
        const query = estimateQueries.GET_ESTIMATES_BY_SLUGS;
        const variables = { slugs };
        const response = await this.client.query(query, variables);
        return response.data.estimatesBySlugs;
    }
    /**
     * Retrieves estimates by buyer user ID
     */
    async getByBuyerUserId(buyerUserId) {
        const query = estimateQueries.GET_ESTIMATES_BY_BUYER_USER_ID;
        const response = await this.client.query(query, { buyerUserId });
        return response.estimatesByBuyerUserId;
    }
    /**
     * Retrieves estimates by buyer organization ID
     */
    async getByBuyerOrganizationId(buyerOrganizationId) {
        const query = estimateQueries.GET_ESTIMATES_BY_BUYER_ORGANIZATION_ID;
        const response = await this.client.query(query, { buyerOrganizationId });
        return response.estimatesByBuyerOrganizationId;
    }
    /**
     * Retrieves estimates by seller organization ID
     */
    async getBySellerOrganizationId(sellerOrganizationId) {
        const query = estimateQueries.GET_ESTIMATES_BY_SELLER_ORGANIZATION_ID;
        const response = await this.client.query(query, { sellerOrganizationId });
        return response.estimatesBySellerOrganizationId;
    }
    // Negotiation methods
    /**
     * Creates a new negotiation for an estimate
     */
    async createNegotiation(input) {
        const query = estimateQueries.CREATE_NEGOTIATION;
        const response = await this.client.mutate(query, { input });
        return response.createNegotiation;
    }
    /**
     * Accepts the current negotiation for an estimate
     */
    async acceptNegotiation(estimateId) {
        const query = estimateQueries.ACCEPT_NEGOTIATION;
        const response = await this.client.mutate(query, { estimateId });
        return response.acceptNegotiation;
    }
    /**
     * Rejects the current negotiation for an estimate
     */
    async rejectNegotiation(estimateId) {
        const query = estimateQueries.REJECT_NEGOTIATION;
        const response = await this.client.mutate(query, { estimateId });
        return response.rejectNegotiation;
    }
    /**
     * Retrieves the negotiation history for an estimate
     */
    async getNegotiationHistory(estimateId) {
        const query = estimateQueries.GET_NEGOTIATION_HISTORY;
        const response = await this.client.query(query, { estimateId });
        return response.getNegotiationHistory;
    }
    /**
     * Retrieves the current active negotiation for an estimate
     */
    async getCurrentNegotiation(estimateId) {
        const query = estimateQueries.GET_CURRENT_NEGOTIATION;
        const response = await this.client.query(query, { estimateId });
        return response.getCurrentNegotiation;
    }
}
