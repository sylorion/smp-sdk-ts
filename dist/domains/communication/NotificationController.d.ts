import { APIClient } from '../../api/APIClient.js';
import type { NotificationActionKey, NotificationCategory, NotificationCounters, NotificationFeedItem, NotificationTab } from './notifications/notifications.generated.js';
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
 * `recordAction`, `reopen`, `markAllReadInScope` — le périmètre vient de l'identité portée par
 * le client (jeton utilisateur ou assertion signée), jamais des variables. Les méthodes
 * historiques (`getByUserId`, `getByOrganizationId`, `markAsRead`) restent pour l'app mobile ;
 * mu-notification les réserve désormais au titulaire du fil ou aux membres de l'organisation.
 */
export declare class Notification {
    private client;
    constructor(client: APIClient);
    /** Notification par identifiant, ou `null` si elle n'existe pas (ou hors périmètre). */
    getById(notificationID: string): Promise<any | null>;
    getByIds(notificationIDs: string[]): Promise<any[]>;
    getByUniqRef(uniqRef: string): Promise<any>;
    getBySlug(slug: string): Promise<any>;
    getBySlugs(slugs: string[]): Promise<any[]>;
    getByUserId(userID: string): Promise<any[]>;
    getByOrganizationId(organizationID: string): Promise<any[]>;
    markAsRead(notificationID: string): Promise<any>;
    /** Fil paginé de l'appelant (curseur opaque dans `nextCursor`). */
    feed(input?: NotificationFeedInput): Promise<NotificationFeedPage>;
    /** Non lues, à traiter, à traiter par catégorie (et par espace en vue unifiée). */
    counters(organizationID?: string | null): Promise<NotificationCounters>;
    markRead(notificationID: string): Promise<NotificationFeedItem>;
    markUnread(notificationID: string): Promise<NotificationFeedItem>;
    /** « Plus tard » ; `until` null annule le report. */
    snooze(notificationID: string, until: string | null): Promise<NotificationFeedItem>;
    /** À appeler APRÈS le succès de l'action métier : enregistre le traitement. */
    recordAction(input: RecordNotificationActionInput): Promise<NotificationFeedItem>;
    reopen(notificationID: string): Promise<NotificationFeedItem>;
    /** Tout marquer comme lu dans le périmètre de l'appelant ; renvoie le nombre de lignes. */
    markAllReadInScope(organizationID?: string | null): Promise<number>;
}
