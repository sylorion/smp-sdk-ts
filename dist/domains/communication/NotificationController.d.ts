import { APIClient } from '../../api/APIClient.js';
/**
 * The `Notification` class manages notification-related requests within the application.
 */
export declare class Notification {
    private client;
    constructor(client: APIClient);
    /** Notification par identifiant, ou `null` si elle n'existe pas. */
    getById(notificationID: string): Promise<any | null>;
    getByIds(notificationIDs: string[]): Promise<any[]>;
    getByUniqRef(uniqRef: string): Promise<any>;
    getBySlug(slug: string): Promise<any>;
    getBySlugs(slugs: string[]): Promise<any[]>;
    getByUserId(userID: string): Promise<any[]>;
    getByOrganizationId(organizationID: string): Promise<any[]>;
    markAsRead(notificationID: string): Promise<any>;
}
