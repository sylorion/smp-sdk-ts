// smp-sdk-ts/src/notification/notification.ts
import { notificationQueries } from '../../api/graphql/communication/queries.js';
/**
 * The `Notification` class manages notification-related requests within the application.
 */
export class Notification {
    constructor(client) {
        this.client = client;
    }
    async list(pagination, sort, filter) {
        const query = notificationQueries.GET_NOTIFICATIONS;
        const variables = { pagination, sort, filter };
        const response = await this.client.query(query, variables);
        return response.notifications;
    }
    async getById(notificationID) {
        const query = notificationQueries.GET_NOTIFICATION_BY_ID;
        const variables = { notificationID };
        const response = await this.client.query(query, variables);
        return response.notificationByID;
    }
    async getByIds(notificationIDs) {
        const query = notificationQueries.GET_NOTIFICATIONS_BY_IDS;
        const variables = { notificationIDs };
        const response = await this.client.query(query, variables);
        return response.notificationsByIDs;
    }
    async getByUniqRef(uniqRef) {
        const query = notificationQueries.GET_NOTIFICATION_BY_UNIQ_REF;
        const variables = { uniqRef };
        const response = await this.client.query(query, variables);
        return response.notificationByUniqRef;
    }
    async getBySlug(slug) {
        const query = notificationQueries.GET_NOTIFICATION_BY_SLUG;
        const variables = { slug };
        const response = await this.client.query(query, variables);
        return response.notificationBySlug;
    }
    async getBySlugs(slugs) {
        const query = notificationQueries.GET_NOTIFICATIONS_BY_SLUGS;
        const variables = { slugs };
        const response = await this.client.query(query, variables);
        return response.notificationsBySlugs;
    }
    async getByUserId(userID) {
        const query = notificationQueries.GET_NOTIFICATIONS_BY_USER_ID;
        const variables = { userID };
        const response = await this.client.query(query, variables);
        return response.notificationsByUserID;
    }
    async getByOrganizationId(organizationID) {
        const query = notificationQueries.GET_NOTIFICATIONS_BY_ORGANIZATION_ID;
        const variables = { organizationID };
        const response = await this.client.query(query, variables);
        return response.notificationsByOrganizationID;
    }
    async markAsRead(notificationID) {
        const query = notificationQueries.MARK_NOTIFICATION_AS_READ;
        const variables = { notificationID };
        const response = await this.client.mutate(query, variables);
        return response.markNotificationAsRead;
    }
}
