import { userPlanQueries } from '../../api/graphql/user/queries.js';
/**
 * PlanController
 *
 * Fetches live subscription plan data from mu-authentication via the GraphQL gateway.
 * Use this to get the real plan from the DB, bypassing the stale JWT token.
 *
 * Usage:
 *   const sdk = new SmpSdk({ ... });
 *   const planData = await sdk.user.plan.getMyPlan(userID);
 */
export class PlanController {
    constructor(client) {
        this.client = client;
    }
    /**
     * Fetch the authenticated user's live plan data directly from the DB.
     * @param userID - The user's UUID
     */
    async getMyPlan(userID) {
        const query = userPlanQueries.GET_MY_PLAN;
        const variables = { userID };
        const response = await this.client.query(query, variables);
        return response.getMyPlan ?? null;
    }
}
