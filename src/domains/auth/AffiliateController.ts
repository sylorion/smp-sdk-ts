import { APIClient } from '../../api/APIClient.js';
import { affiliateQueries } from '../../api/graphql/user/queries.js';
import { affiliateMutations } from '../../api/graphql/user/mutations.js';

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
    private client: APIClient;

    constructor(client: APIClient) {
        this.client = client;
    }

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

    async sendAffiliationInvitation(input: {
        recipientEmail: string;
        referrerUserId: string;
        referrerName?: string;
        invitationToken?: string;
        message?: string;
    }): Promise<{ success: boolean; message: string }> {
        const mutation = affiliateMutations.SEND_AFFILIATION_INVITATION;
        const response = await this.client.mutate(mutation, input) as { sendAffiliationInvitation: { success: boolean; message: string } };
        return response.sendAffiliationInvitation;
    }
}
