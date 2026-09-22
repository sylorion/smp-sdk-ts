import { affiliateQueries } from '../api/graphql/queries/authentication/affiliateQueries.js';
import { affiliateMutations } from '../api/graphql/mutations/authentication/affiliateMutations.js';
export class AffiliateController {
    constructor(client) {
        this.client = client;
    }
    async getAffiliatesByReferrer(referrerUserId) {
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
    async createAffiliate(input) {
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
