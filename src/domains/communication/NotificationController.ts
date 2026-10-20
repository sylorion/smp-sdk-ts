// smp-sdk-ts/src/domains/communication/NotificationController.ts

import { APIClient } from '../../api/APIClient.js';
import { notificationQueries } from '../../api/graphql/communication/queries.js';
import { notificationFeedMutations, notificationFeedQueries } from '../../api/graphql/communication/notificationFeed.js';
import type {
  NotificationActionKey,
  NotificationCategory,
  NotificationCounters,
  NotificationFeedItem,
  NotificationTab,
} from './notifications/notifications.generated.js';

/** Paramètres du fil : organisation seule, ou vue unifiée de l'appelant (sans `organizationID`). */
export interface NotificationFeedInput {
  organizationID?: string | null;
  tab?: NotificationTab;
  category?: NotificationCategory;
  cursor?: string | null;
  limit?: number;
}

export interface NotificationFeedPage {
  items: NotificationFeedItem[];
  nextCursor: string | null;
}

export interface RecordNotificationActionInput {
  notificationID: string;
  actionKey: NotificationActionKey;
  /** `done` (défaut) ou `dismissed`. */
  state?: 'done' | 'dismissed';
  /** Appel de service seulement : utilisateur qui a agi (authentifié par la route BFF). */
  actedByUserID?: string;
}

/**
 * The `Notification` class manages notification-related requests within the application.
 *
 * Centre de notifications (20/10) : `feed`, `counters`, `markRead` / `markUnread`, `snooze`,
 * `recordAction`, `reopen`, `markManyRead`, `markAllReadInScope` — le périmètre vient de l'identité portée par
 * le client (jeton utilisateur ou assertion signée), jamais des variables. Les méthodes
 * historiques (`getByUserId`, `getByOrganizationId`, `markAsRead`) restent pour l'app mobile ;
 * mu-notification les réserve désormais au titulaire du fil ou aux membres de l'organisation.
 */
export class Notification {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  /** Notification par identifiant, ou `null` si elle n'existe pas (ou hors périmètre). */
  async getById(notificationID: string): Promise<any | null> {
    const query = notificationQueries.GET_NOTIFICATION_BY_ID;
    const variables = { notificationID };
    const response = await this.client.query(query, variables) as { notification: any | null };
    return response?.notification ?? null;
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

  // ======================= Centre de notifications (20/10) =======================

  /** Fil paginé de l'appelant (curseur opaque dans `nextCursor`). */
  async feed(input: NotificationFeedInput = {}): Promise<NotificationFeedPage> {
    const variables = { input: { ...input, organizationID: input.organizationID ?? null } };
    const response = await this.client.query(notificationFeedQueries.NOTIFICATION_FEED, variables) as { notificationFeed: NotificationFeedPage };
    return { items: response.notificationFeed?.items ?? [], nextCursor: response.notificationFeed?.nextCursor ?? null };
  }

  /** Non lues, à traiter, à traiter par catégorie (et par espace en vue unifiée). */
  async counters(organizationID?: string | null): Promise<NotificationCounters> {
    const response = await this.client.query(notificationFeedQueries.NOTIFICATION_COUNTERS, { organizationID: organizationID ?? null }) as { notificationCounters: NotificationCounters };
    return response.notificationCounters;
  }

  async markRead(notificationID: string): Promise<NotificationFeedItem> {
    const response = await this.client.mutate(notificationFeedMutations.MARK_NOTIFICATION_READ, { notificationID }) as { markNotificationRead: NotificationFeedItem };
    return response.markNotificationRead;
  }

  async markUnread(notificationID: string): Promise<NotificationFeedItem> {
    const response = await this.client.mutate(notificationFeedMutations.MARK_NOTIFICATION_UNREAD, { notificationID }) as { markNotificationUnread: NotificationFeedItem };
    return response.markNotificationUnread;
  }

  /** « Plus tard » ; `until` null annule le report. */
  async snooze(notificationID: string, until: string | null): Promise<NotificationFeedItem> {
    const response = await this.client.mutate(notificationFeedMutations.SNOOZE_NOTIFICATION, { notificationID, until }) as { snoozeNotification: NotificationFeedItem };
    return response.snoozeNotification;
  }

  /** À appeler APRÈS le succès de l'action métier : enregistre le traitement. */
  async recordAction(input: RecordNotificationActionInput): Promise<NotificationFeedItem> {
    const response = await this.client.mutate(notificationFeedMutations.RECORD_NOTIFICATION_ACTION, { input }) as { recordNotificationAction: NotificationFeedItem };
    return response.recordNotificationAction;
  }

  async reopen(notificationID: string): Promise<NotificationFeedItem> {
    const response = await this.client.mutate(notificationFeedMutations.REOPEN_NOTIFICATION, { notificationID }) as { reopenNotification: NotificationFeedItem };
    return response.reopenNotification;
  }

  /** Lot : marque lues les notifications données (200 max) en une mutation ; renvoie le nombre mis à jour. */
  async markManyRead(notificationIDs: string[]): Promise<number> {
    const ids = Array.from(new Set(notificationIDs.filter((id) => typeof id === 'string' && id.length > 0)));
    if (ids.length === 0) return 0;
    const response = await this.client.mutate(notificationFeedMutations.MARK_NOTIFICATIONS_READ, { notificationIDs: ids }) as { markNotificationsRead: number };
    return response.markNotificationsRead ?? 0;
  }

  /** Tout marquer comme lu dans le périmètre de l'appelant ; renvoie le nombre de lignes. */
  async markAllReadInScope(organizationID?: string | null): Promise<number> {
    const response = await this.client.mutate(notificationFeedMutations.MARK_ALL_NOTIFICATIONS_READ_IN_SCOPE, { organizationID: organizationID ?? null }) as { markAllNotificationsReadInScope: number };
    return response.markAllNotificationsReadInScope ?? 0;
  }
}
