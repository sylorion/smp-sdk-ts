import { APIClient } from '../../api/APIClient.js';
export interface UserPlanInfo {
    userID: string;
    plan: string | null;
    planSubscriptionId: string | null;
    planExpiresAt: string | null;
    planTrialEndsAt: string | null;
    stripeCustomerId: string | null;
    planBillingInterval: string | null;
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
export declare class PlanController {
    private client;
    constructor(client: APIClient);
    /**
     * Fetch the authenticated user's live plan data directly from the DB.
     * @param userID - The user's UUID
     */
    getMyPlan(userID: string): Promise<UserPlanInfo | null>;
}
