import { affiliateQueries } from '../../api/graphql/auth/queries.js';
import { affiliateMutations } from '../../api/graphql/auth/mutations.js';
export class AffiliateController {
    constructor(client) {
        this.client = client;
    }
    async getAffiliatesByReferrer(referrerUserId) {
        const query = affiliateQueries.GET_AFFILIATES_BY_REFERRER;
        const response = await this.client.query(query, { referrerUserId });
        return response.affiliatesByReferrer;
    }
    async getAffiliateLinksByReferrer(referrerUserId) {
        const query = affiliateQueries.GET_AFFILIATE_LINKS_BY_REFERRER;
        const response = await this.client.query(query, { referrerUserId });
        return response.affiliateLinksByReferrer;
    }
    async getAffiliateLinkByToken(token) {
        const query = affiliateQueries.GET_AFFILIATE_LINK_BY_TOKEN;
        const response = await this.client.query(query, { token });
        return response.affiliateLinkByToken;
    }
    async createAffiliateLink(input) {
        const mutation = affiliateMutations.CREATE_AFFILIATE_LINK;
        const response = await this.client.mutate(mutation, { input });
        return response.createAffiliateLink;
    }
    async updateAffiliateLink(id, input) {
        const mutation = affiliateMutations.UPDATE_AFFILIATE_LINK;
        const response = await this.client.mutate(mutation, { id, input });
        return response.updateAffiliateLink;
    }
    async deleteAffiliateLink(id) {
        const mutation = affiliateMutations.DELETE_AFFILIATE_LINK;
        const response = await this.client.mutate(mutation, { id });
        return response.deleteAffiliateLink;
    }
    // Legacy methods from auth/AffiliateController
    async listByReferrerUserId(referrerUserId) {
        const query = affiliateQueries.GET_AFFILIATES_BY_REFERRER;
        const variables = { referrerUserId };
        const response = await this.client.query(query, variables);
        return response.affiliatesByReferrer;
    }
    async generateAffiliateToken(input) {
        const mutation = affiliateMutations.GENERATE_AFFILIATE_TOKEN;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.generateAffiliateToken;
    }
    async create(input) {
        const mutation = affiliateMutations.CREATE_AFFILIATE;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createAffiliate;
    }
    async decodeAffiliateToken(token) {
        const mutation = affiliateMutations.DECODE_AFFILIATE_TOKEN;
        const variables = { token };
        const response = await this.client.mutate(mutation, variables);
        return response.decodeAffiliateToken;
    }
}
