// smp-sdk-ts/src/notification/notification.ts
import { notificationQueries } from '../api/graphql/queries/notification/notificationQueries.js';
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
        return response.data.notifications;
    }
    async getById(notificationID) {
        const query = notificationQueries.GET_NOTIFICATION_BY_ID;
        const variables = { notificationID };
        const response = await this.client.query(query, variables);
        return response.data.notificationByID;
    }
    async getByIDs(notificationIDs) {
        const query = notificationQueries.GET_NOTIFICATIONS_BY_IDS;
        const variables = { notificationIDs };
        const response = await this.client.query(query, variables);
        return response.data.notificationsByIDs;
    }
    async getByUniqRef(uniqRef) {
        const query = notificationQueries.GET_NOTIFICATION_BY_UNIQ_REF;
        const variables = { uniqRef };
        const response = await this.client.query(query, variables);
        return response.data.notificationByUniqRef;
    }
    async getBySlug(slug) {
        const query = notificationQueries.GET_NOTIFICATION_BY_SLUG;
        const variables = { slug };
        const response = await this.client.query(query, variables);
        return response.data.notificationBySlug;
    }
    async getBySlugs(slugs) {
        const query = notificationQueries.GET_NOTIFICATIONS_BY_SLUGS;
        const variables = { slugs };
        const response = await this.client.query(query, variables);
        return response.data.notificationsBySlugs;
    }
}
