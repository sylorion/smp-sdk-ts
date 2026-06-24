import { APIClient } from '../../api/APIClient.js';
import { adminAuthQueries } from '../../api/graphql/auth/queries.js';

export interface AdminUserEntity {
  userID: string;
  username: string;
  email: string;
  profileID?: string;
  plan?: string;
  state?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlanStatEntity {
  plan: string;
  count: number;
}

/**
 * AdminUserController — admin-only queries targeting mu-authentication.
 *
 * The authentication service holds the canonical user table (username, email, plan, state).
 * These queries search across ALL users regardless of their state (no `state: 'online'` filter).
 * Use these instead of the organization `searchUsers` which is limited to online users only.
 */
export class AdminUserController {
  constructor(private readonly client: APIClient) {}

  /**
   * Search users by username OR email (case-insensitive, partial match).
   * Also matches exact userID.
   */
  async searchUsers(query: string, limit = 20): Promise<AdminUserEntity[]> {
    const response = await this.client.query<{ adminSearchUsers: AdminUserEntity[] }>(
      adminAuthQueries.ADMIN_SEARCH_USERS,
      { query, limit }
    );
    return response.adminSearchUsers ?? [];
  }

  /** Get a single user by UUID */
  async getByID(userID: string): Promise<AdminUserEntity | null> {
    const response = await this.client.query<{ adminGetUserByID: AdminUserEntity | null }>(
      adminAuthQueries.ADMIN_GET_USER_BY_ID,
      { userID }
    );
    return response.adminGetUserByID ?? null;
  }

  /** Get a single user by email address */
  async getByEmail(email: string): Promise<AdminUserEntity | null> {
    const response = await this.client.query<{ adminGetUserByEmail: AdminUserEntity | null }>(
      adminAuthQueries.ADMIN_GET_USER_BY_EMAIL,
      { email }
    );
    return response.adminGetUserByEmail ?? null;
  }

  /** Get user count grouped by plan — for dashboard stats */
  async getPlanStats(): Promise<PlanStatEntity[]> {
    const response = await this.client.query<{ adminGetPlanStats: PlanStatEntity[] }>(
      adminAuthQueries.ADMIN_GET_PLAN_STATS,
      {}
    );
    return response.adminGetPlanStats ?? [];
  }

  /** Get total user count — for dashboard stats */
  async getUserCount(): Promise<number> {
    const response = await this.client.query<{ adminGetUserCount: number }>(
      adminAuthQueries.ADMIN_GET_USER_COUNT,
      {}
    );
    return response.adminGetUserCount ?? 0;
  }
}
