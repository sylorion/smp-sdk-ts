import { APIClient } from '../../api/APIClient.js';
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
export declare class AffiliateController {
    private client;
    constructor(client: APIClient);
    getAffiliatesByReferrer(referrerUserId: string): Promise<any[]>;
    getAffiliateLinksByReferrer(referrerUserId: string): Promise<any[]>;
    getAffiliateLinkByToken(token: string): Promise<any>;
    createAffiliateLink(input: {
        referrerUserId: string;
        label?: string;
    }): Promise<any>;
    updateAffiliateLink(id: string, input: {
        label?: string;
        isActive?: boolean;
    }): Promise<any>;
    deleteAffiliateLink(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    listByReferrerUserId(referrerUserId: string): Promise<Affiliate[]>;
    generateAffiliateToken(input: GenerateAffiliateTokenInput): Promise<AffiliateTokenResponse>;
    create(input: any): Promise<Affiliate>;
    decodeAffiliateToken(token: string): Promise<AffiliateTokenInfo>;
}
