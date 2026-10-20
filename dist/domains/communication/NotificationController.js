// smp-sdk-ts/src/domains/communication/NotificationController.ts
import { notificationQueries } from '../../api/graphql/communication/queries.js';
import { notificationFeedMutations, notificationFeedQueries } from '../../api/graphql/communication/notificationFeed.js';
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
    constructor(client) {
        this.client = client;
    }
    /** Notification par identifiant, ou `null` si elle n'existe pas (ou hors périmètre). */
    async getById(notificationID) {
        const query = notificationQueries.GET_NOTIFICATION_BY_ID;
        const variables = { notificationID };
        const response = await this.client.query(query, variables);
        return response?.notification ?? null;
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
    // ======================= Centre de notifications (20/10) =======================
    /** Fil paginé de l'appelant (curseur opaque dans `nextCursor`). */
    async feed(input = {}) {
        const variables = { input: { ...input, organizationID: input.organizationID ?? null } };
        const response = await this.client.query(notificationFeedQueries.NOTIFICATION_FEED, variables);
        return { items: response.notificationFeed?.items ?? [], nextCursor: response.notificationFeed?.nextCursor ?? null };
    }
    /** Non lues, à traiter, à traiter par catégorie (et par espace en vue unifiée). */
    async counters(organizationID) {
        const response = await this.client.query(notificationFeedQueries.NOTIFICATION_COUNTERS, { organizationID: organizationID ?? null });
        return response.notificationCounters;
    }
    async markRead(notificationID) {
        const response = await this.client.mutate(notificationFeedMutations.MARK_NOTIFICATION_READ, { notificationID });
        return response.markNotificationRead;
    }
    async markUnread(notificationID) {
        const response = await this.client.mutate(notificationFeedMutations.MARK_NOTIFICATION_UNREAD, { notificationID });
        return response.markNotificationUnread;
    }
    /** « Plus tard » ; `until` null annule le report. */
    async snooze(notificationID, until) {
        const response = await this.client.mutate(notificationFeedMutations.SNOOZE_NOTIFICATION, { notificationID, until });
        return response.snoozeNotification;
    }
    /** À appeler APRÈS le succès de l'action métier : enregistre le traitement. */
    async recordAction(input) {
        const response = await this.client.mutate(notificationFeedMutations.RECORD_NOTIFICATION_ACTION, { input });
        return response.recordNotificationAction;
    }
    async reopen(notificationID) {
        const response = await this.client.mutate(notificationFeedMutations.REOPEN_NOTIFICATION, { notificationID });
        return response.reopenNotification;
    }
    /** Lot : marque lues les notifications données (200 max) en une mutation ; renvoie le nombre mis à jour. */
    async markManyRead(notificationIDs) {
        const ids = Array.from(new Set(notificationIDs.filter((id) => typeof id === 'string' && id.length > 0)));
        if (ids.length === 0)
            return 0;
        const response = await this.client.mutate(notificationFeedMutations.MARK_NOTIFICATIONS_READ, { notificationIDs: ids });
        return response.markNotificationsRead ?? 0;
    }
    /** Tout marquer comme lu dans le périmètre de l'appelant ; renvoie le nombre de lignes. */
    async markAllReadInScope(organizationID) {
        const response = await this.client.mutate(notificationFeedMutations.MARK_ALL_NOTIFICATIONS_READ_IN_SCOPE, { organizationID: organizationID ?? null });
        return response.markAllNotificationsReadInScope ?? 0;
    }
}
