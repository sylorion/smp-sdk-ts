import { APIClient } from '../api/APIClient.js';

export interface Affiliate {
    affiliateId: string;
    referrerUserId: string;
    referredUserId?: string;
    affiliateToken: string;
    email?: string;
    isValidated: boolean;
    validatedAt?: string;
    commissionRate?: number;
    metadata?: any;
    createdAt: string;
    updatedAt: string;
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

export class AffiliateController {
    private client: APIClient;

    constructor(client: APIClient) {
        this.client = client;
    }

    async getAffiliatesByReferrer(referrerUserId: string): Promise<Affiliate[]> {
        const query = `
      query AffiliatesByReferrer($referrerUserId: ID!) {
        affiliatesByReferrer(referrerUserId: $referrerUserId) {
          affiliateId
          affiliateToken
          email
          isValidated
          validatedAt
          referredUserId
          createdAt
        }
      }
    `;
        const variables = { referrerUserId };
        const response = await this.client.query(query, variables) as { affiliatesByReferrer: Affiliate[] };
        return response.affiliatesByReferrer;
    }

    async generateAffiliateToken(input: GenerateAffiliateTokenInput): Promise<AffiliateTokenResponse> {
        const mutation = `
      mutation GenerateAffiliateToken($input: GenerateAffiliateTokenInput!) {
        generateAffiliateToken(input: $input) {
          affiliateToken
          expiresAt
          message
          errors {
            message
          }
        }
      }
    `;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables) as { generateAffiliateToken: AffiliateTokenResponse };
        return response.generateAffiliateToken;
    }
}
