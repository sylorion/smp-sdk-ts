import { APIClient } from '../../api/APIClient.js';
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
export declare class AdminUserController {
    private readonly client;
    constructor(client: APIClient);
    /**
     * Search users by username OR email (case-insensitive, partial match).
     * Also matches exact userID.
     */
    searchUsers(query: string, limit?: number): Promise<AdminUserEntity[]>;
    /** Get a single user by UUID */
    getByID(userID: string): Promise<AdminUserEntity | null>;
    /** Get a single user by email address */
    getByEmail(email: string): Promise<AdminUserEntity | null>;
    /** Get user count grouped by plan — for dashboard stats */
    getPlanStats(): Promise<PlanStatEntity[]>;
    /** Get total user count — for dashboard stats */
    getUserCount(): Promise<number>;
}
