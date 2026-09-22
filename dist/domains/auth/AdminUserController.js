import { adminAuthQueries } from '../../api/graphql/auth/queries.js';
/**
 * AdminUserController — admin-only queries targeting mu-authentication.
 *
 * The authentication service holds the canonical user table (username, email, plan, state).
 * These queries search across ALL users regardless of their state (no `state: 'online'` filter).
 * Use these instead of the organization `searchUsers` which is limited to online users only.
 */
export class AdminUserController {
    constructor(client) {
        this.client = client;
    }
    /**
     * Search users by username OR email (case-insensitive, partial match).
     * Also matches exact userID.
     */
    async searchUsers(query, limit = 20) {
        const response = await this.client.query(adminAuthQueries.ADMIN_SEARCH_USERS, { query, limit });
        return response.adminSearchUsers ?? [];
    }
    /** Get a single user by UUID */
    async getByID(userID) {
        const response = await this.client.query(adminAuthQueries.ADMIN_GET_USER_BY_ID, { userID });
        return response.adminGetUserByID ?? null;
    }
    /** Get a single user by email address */
    async getByEmail(email) {
        const response = await this.client.query(adminAuthQueries.ADMIN_GET_USER_BY_EMAIL, { email });
        return response.adminGetUserByEmail ?? null;
    }
    /** Get user count grouped by plan — for dashboard stats */
    async getPlanStats() {
        const response = await this.client.query(adminAuthQueries.ADMIN_GET_PLAN_STATS, {});
        return response.adminGetPlanStats ?? [];
    }
    /** Get total user count — for dashboard stats */
    async getUserCount() {
        const response = await this.client.query(adminAuthQueries.ADMIN_GET_USER_COUNT, {});
        return response.adminGetUserCount ?? 0;
    }
}
