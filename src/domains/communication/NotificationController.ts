// smp-sdk-ts/src/notification/notification.ts

import { APIClient } from '../../api/APIClient.js';
import { notificationQueries } from '../../api/graphql/communication/queries.js';

/**
 * The `Notification` class manages notification-related requests within the application.
 */
export class Notification {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  async list(pagination?: any, sort?: any, filter?: any): Promise<any[]> {
    const query = notificationQueries.GET_NOTIFICATIONS;
    const variables = { pagination, sort, filter };
    const response = await this.client.query(query, variables) as { notifications: any[] };
    return response.notifications;
  }

  async getById(notificationID: string): Promise<any> {
    const query = notificationQueries.GET_NOTIFICATION_BY_ID;
    const variables = { notificationID };
    const response = await this.client.query(query, variables) as { notificationByID: any };
    return response.notificationByID;
  }

  async getByIds(notificationIDs: string[]): Promise<any[]> {
    const query = notificationQueries.GET_NOTIFICATIONS_BY_IDS;
    const variables = { notificationIDs };
    const response = await this.client.query(query, variables) as { notificationsByIDs: any[] };
    return response.notificationsByIDs;
  }

  async getByUniqRef(uniqRef: string): Promise<any> {
    const query = notificationQueries.GET_NOTIFICATION_BY_UNIQ_REF;
    const variables = { uniqRef };
    const response = await this.client.query(query, variables) as { notificationByUniqRef: any };
    return response.notificationByUniqRef;
  }

  async getBySlug(slug: string): Promise<any> {
    const query = notificationQueries.GET_NOTIFICATION_BY_SLUG;
    const variables = { slug };
    const response = await this.client.query(query, variables) as { notificationBySlug: any };
    return response.notificationBySlug;
  }

  async getBySlugs(slugs: string[]): Promise<any[]> {
    const query = notificationQueries.GET_NOTIFICATIONS_BY_SLUGS;
    const variables = { slugs };
    const response = await this.client.query(query, variables) as { notificationsBySlugs: any[] };
    return response.notificationsBySlugs;
  }

  async getByUserId(userID: string): Promise<any[]> {
    const query = notificationQueries.GET_NOTIFICATIONS_BY_USER_ID;
    const variables = { userID };
    const response = await this.client.query(query, variables) as { notificationsByUserID: any[] };
    return response.notificationsByUserID;
  }

  async getByOrganizationId(organizationID: string): Promise<any[]> {
    const query = notificationQueries.GET_NOTIFICATIONS_BY_ORGANIZATION_ID;
    const variables = { organizationID };
    const response = await this.client.query(query, variables) as { notificationsByOrganizationID: any[] };
    return response.notificationsByOrganizationID;
  }

  async markAsRead(notificationID: string): Promise<any> {
    const query = notificationQueries.MARK_NOTIFICATION_AS_READ;
    const variables = { notificationID };
    const response = await this.client.mutate(query, variables) as { markNotificationAsRead: any };
    return response.markNotificationAsRead;
  }
}
