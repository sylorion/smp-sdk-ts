import { APIClient } from '../../api/APIClient.js';
import { affiliateQueries } from '../../api/graphql/auth/queries.js';
import { affiliateMutations } from '../../api/graphql/auth/mutations.js';

export interface Affiliate {
    affiliateId: string;
    uniqRef?: string;
    slug?: string;
    referrerUserId: string;
    referredUserId?: string;
    referredUser?: {
        userID: string;
        username?: string;
        email?: string;
        profileID?: string;
        loginDuration?: number;
        lastLogin?: string;
    };
    affiliateToken: string;
    email?: string;
    isValidated: boolean;
    validatedAt?: string;
    expiresAt?: string;
    commissionRate?: number;
    metadata?: any;
    state?: any;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}

export interface GenerateAffiliateTokenInput {
    referrerUserId: string;
    email?: string;
    expiresAt?: string;
    commissionRate?: number;
    metadata?: any;
}

export interface AffiliateTokenResponse {
    affiliateToken: string;
    expiresAt?: string;
    message: string;
    errors?: any[];
}

export interface AffiliateTokenInfo {
    referrerUserId: string;
    referrerUsername?: string;
    type: string;
    createdAt?: string;
    isValid: boolean;
    message?: string;
}

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

    // Legacy methods from auth/AffiliateController
    async listByReferrerUserId(referrerUserId: string): Promise<Affiliate[]> {
        const query = affiliateQueries.GET_AFFILIATES_BY_REFERRER;
        const variables = { referrerUserId };
        const response = await this.client.query(query, variables) as { affiliatesByReferrer: Affiliate[] };
        return response.affiliatesByReferrer;
    }

    async generateAffiliateToken(input: GenerateAffiliateTokenInput): Promise<AffiliateTokenResponse> {
        const mutation = affiliateMutations.GENERATE_AFFILIATE_TOKEN;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables) as { generateAffiliateToken: AffiliateTokenResponse };
        return response.generateAffiliateToken;
    }

    async create(input: any): Promise<Affiliate> {
        const mutation = affiliateMutations.CREATE_AFFILIATE;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables) as { createAffiliate: Affiliate };
        return response.createAffiliate;
    }

    async decodeAffiliateToken(token: string): Promise<AffiliateTokenInfo> {
        const mutation = affiliateMutations.DECODE_AFFILIATE_TOKEN;
        const variables = { token };
        const response = await this.client.mutate(mutation, variables) as { decodeAffiliateToken: AffiliateTokenInfo };
        return response.decodeAffiliateToken;
    }
}
