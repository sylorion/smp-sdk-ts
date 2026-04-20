import { APIClient } from '../../api/APIClient.js';
import { userPlanQueries } from '../../api/graphql/user/queries.js';

export interface UserPlanInfo {
  userID: string;
  plan: string | null;
  planSubscriptionId: string | null;
  planExpiresAt: string | null;  // ISO string from GraphQL Date scalar
  planTrialEndsAt: string | null;
  stripeCustomerId: string | null;
}

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
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  /**
   * Fetch the authenticated user's live plan data directly from the DB.
   * @param userID - The user's UUID
   */
  async getMyPlan(userID: string): Promise<UserPlanInfo | null> {
    const query = userPlanQueries.GET_MY_PLAN;
    const variables = { userID };
    const response = await this.client.query(query, variables) as { getMyPlan: UserPlanInfo | null };
    return response.getMyPlan ?? null;
  }
}
