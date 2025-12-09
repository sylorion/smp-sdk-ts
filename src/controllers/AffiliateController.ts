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
}

export interface GenerateAffiliateTokenResponse {
    affiliateToken: string;
    message: string;
}

export class AffiliateController {
    private client: APIClient;

    constructor(client: APIClient) {
        this.client = client;
    }

    async getAffiliatesByReferrer(referrerUserId: string): Promise<Affiliate[]> {
        const query = `
      query AffiliatesByReferrer($referrerUserId: String!) {
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

    async generateAffiliateToken(input: GenerateAffiliateTokenInput): Promise<GenerateAffiliateTokenResponse> {
        const mutation = `
      mutation GenerateAffiliateToken($input: JSON!) {
        generateAffiliateToken(input: $input) {
          affiliateToken
          message
        }
      }
    `;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables) as { generateAffiliateToken: GenerateAffiliateTokenResponse };
        return response.generateAffiliateToken;
    }
}
