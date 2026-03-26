import { APIClient } from '../../api/APIClient.js';
import { affiliateQueries } from '../../api/graphql/auth/queries.js';
import { affiliateMutations } from '../../api/graphql/auth/mutations.js';

export class AffiliateController {
    constructor(private client: APIClient) { }

    async getAffiliatesByReferrer(referrerUserId: string): Promise<any[]> {
        const query = affiliateQueries.GET_AFFILIATES_BY_REFERRER;
        const response = await this.client.query(query, { referrerUserId }) as { affiliatesByReferrer: any[] };
        return response.affiliatesByReferrer;
    }

    async getAffiliateLinksByReferrer(referrerUserId: string): Promise<any[]> {
        const query = affiliateQueries.GET_AFFILIATE_LINKS_BY_REFERRER;
        const response = await this.client.query(query, { referrerUserId }) as { affiliateLinksByReferrer: any[] };
        return response.affiliateLinksByReferrer;
    }

    async getAffiliateLinkByToken(token: string): Promise<any> {
        const query = affiliateQueries.GET_AFFILIATE_LINK_BY_TOKEN;
        const response = await this.client.query(query, { token }) as { affiliateLinkByToken: any };
        return response.affiliateLinkByToken;
    }

    async createAffiliateLink(input: { referrerUserId: string, label?: string }): Promise<any> {
        const mutation = affiliateMutations.CREATE_AFFILIATE_LINK;
        const response = await this.client.mutate(mutation, { input }) as { createAffiliateLink: any };
        return response.createAffiliateLink;
    }

    async updateAffiliateLink(id: string, input: { label?: string, isActive?: boolean }): Promise<any> {
        const mutation = affiliateMutations.UPDATE_AFFILIATE_LINK;
        const response = await this.client.mutate(mutation, { id, input }) as { updateAffiliateLink: any };
        return response.updateAffiliateLink;
    }

    async deleteAffiliateLink(id: string): Promise<{ success: boolean, message: string }> {
        const mutation = affiliateMutations.DELETE_AFFILIATE_LINK;
        const response = await this.client.mutate(mutation, { id }) as { deleteAffiliateLink: { success: boolean, message: string } };
        return response.deleteAffiliateLink;
    }
}
