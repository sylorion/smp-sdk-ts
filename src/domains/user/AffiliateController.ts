import { APIClient } from '../../api/APIClient.js';
import { affiliateQueries } from '../../api/graphql/auth/queries.js';

export class AffiliateController {
    constructor(private client: APIClient) { }

    async getAffiliatesByReferrer(referrerUserId: string): Promise<any[]> {
        const query = affiliateQueries.GET_AFFILIATES_BY_REFERRER;
        const response = await this.client.query(query, { referrerUserId }) as { affiliatesByReferrer: any[] };
        return response.affiliatesByReferrer;
    }
}
