/**
 * Contrat partagé des notifications SMP — source de vérité unique, recopiée par
 * `scripts/sync-notifications.sh` dans mu-notification, la webapp et le SDK.
 *
 * Il décrit CE QU'EST une notification (catégorie, priorité, action attendue, objet métier,
 * clé de fil) — jamais COMMENT l'action s'exécute : les actions appellent les services métier
 * existants (paiement, devis, agenda, tâches…), qui vérifient les permissions.
 *
 * Voir `docs/architecture/notifications.md`.
 */
export declare const NOTIFICATION_CONTRACT_VERSION = 1;
/** Domaine métier d'une notification (filtres, badges de section, registre d'aperçu). */
export declare const NOTIFICATION_CATEGORIES: readonly ["crm", "leads", "tasks", "projects", "services", "estimates", "invoices", "contracts", "agenda", "marketplace", "automations", "documents", "mentions", "iro", "wallet", "referrals", "account"];
export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];
export declare const NOTIFICATION_PRIORITIES: readonly ["low", "normal", "high", "urgent"];
export type NotificationPriority = (typeof NOTIFICATION_PRIORITIES)[number];
/** État de l'action attendue : `none` (information), `pending` (à traiter), `done`, `dismissed`. */
export declare const NOTIFICATION_ACTION_STATES: readonly ["none", "pending", "done", "dismissed"];
export type NotificationActionState = (typeof NOTIFICATION_ACTION_STATES)[number];
/** Onglets du centre de notifications. */
export declare const NOTIFICATION_TABS: readonly ["all", "todo", "unread", "snoozed", "done"];
export type NotificationTab = (typeof NOTIFICATION_TABS)[number];
/**
 * Actions proposées sur une notification. `mode` :
 *  - `direct`   : un clic, exécutée par une route métier existante (démarrer une tâche, valider un
 *                 livrable, confirmer un rendez-vous), puis la notification passe `done` ;
 *  - `navigate` : ouvre la page de l'objet — actions à choix, à texte, qui engagent (paiement,
 *                 signature, acceptation ou refus d'un devis, relance) ou dont la page porte le parcours.
 * `completes` : l'action traite la notification (état `done`). Quand l'objet change ensuite (facture
 * payée, devis accepté…), c'est l'ÉVÉNEMENT métier qui clôt le fil, pas le clic.
 */
export declare const NOTIFICATION_ACTIONS: {
    readonly pay_invoice: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly remind_invoice: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly view_invoice: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly create_deposit_invoice: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly accept_estimate: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly refuse_estimate: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly view_estimate: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly reply_negotiation: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly sign_contract: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly countersign_contract: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly read_contract: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly start_task: {
        readonly mode: "direct";
        readonly completes: true;
    };
    readonly reassign_task: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly view_task: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly validate_deliverable: {
        readonly mode: "direct";
        readonly completes: true;
    };
    readonly request_changes: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly confirm_booking: {
        readonly mode: "direct";
        readonly completes: true;
    };
    readonly propose_slot: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly view_booking: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly schedule_call: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly assign_lead: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly view_lead: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly reply_mention: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly view_document: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly review_run: {
        readonly mode: "navigate";
        readonly completes: false;
    };
    readonly open: {
        readonly mode: "navigate";
        readonly completes: false;
    };
};
export type NotificationActionKey = keyof typeof NOTIFICATION_ACTIONS;
export type NotificationActionMode = (typeof NOTIFICATION_ACTIONS)[NotificationActionKey]['mode'];
export declare const isNotificationActionKey: (v: unknown) => v is NotificationActionKey;
/** Comment un type d'événement se présente dans le fil. */
export interface NotificationTypeDescriptor {
    category: NotificationCategory;
    priority: NotificationPriority;
    /** L'événement attend une action du destinataire (section « À traiter »). */
    requiresAction: boolean;
    /** Actions proposées, la première est l'action rapide de la cloche. */
    actions: readonly NotificationActionKey[];
    /** L'événement CLÔT le fil de l'objet (le `pending` précédent passe `done`). */
    completesThread?: boolean;
}
/**
 * Descripteur par clé d'événement RabbitMQ (clés de `NotificationEventType` de mu-notification).
 * Une clé absente est décrite par `describeNotificationType` (repli par préfixe).
 */
export declare const NOTIFICATION_TYPES: Record<string, NotificationTypeDescriptor>;
/** Descripteur d'un type d'événement, avec repli par préfixe (information, priorité normale). */
export declare function describeNotificationType(eventType: string | null | undefined): NotificationTypeDescriptor;
/**
 * Capacité de la matrice `libs/shared/org-permissions` requise pour voir les notifications d'une
 * catégorie DANS une organisation (fil d'organisation et vue unifiée). Un membre sans la capacité
 * ne voit ni la ligne ni le compteur.
 */
export declare const NOTIFICATION_CATEGORY_PERMISSION: Record<NotificationCategory, string>;
export declare const isNotificationCategory: (v: unknown) => v is NotificationCategory;
export declare const isNotificationTab: (v: unknown) => v is NotificationTab;
export declare const isNotificationActionState: (v: unknown) => v is NotificationActionState;
export interface NotificationAudience {
    userID?: string | null;
    organizationID?: string | null;
}
/**
 * Clé de fil : un même objet métier, pour un même destinataire, met à jour SA notification au
 * lieu d'en empiler de nouvelles (facture vue → relancée → payée = une seule ligne, historisée).
 * `null` quand l'objet n'est pas identifié : la notification vit seule.
 */
export declare function buildThreadKey(entityType: unknown, entityID: unknown, audience: NotificationAudience): string | null;
/**
 * Clé d'idempotence d'un événement reçu : un rejeu (même événement, même instant, même
 * destinataire) ne produit pas de seconde notification. `occurredAt` vient de l'émetteur
 * (`timestamp`, `occurredAt`, `emittedAt`) ; à défaut l'identifiant de message ; à défaut `null`
 * (pas de garde possible, comportement historique).
 */
export declare function buildEventKey(eventType: string, entityID: unknown, occurredAt: unknown, audience: NotificationAudience, messageId?: unknown): string | null;
export interface NotificationActor {
    /** `user`, `organization` ou `iro` (agent de la plateforme). */
    kind: 'user' | 'organization' | 'iro' | 'system';
    id?: string | null;
    name?: string | null;
    avatarUrl?: string | null;
}
export interface NotificationAmount {
    /** Unités mineures (centimes), devise ISO-4217 explicite. */
    amount: number;
    currency: string;
    /** `HT` / `TTC` quand c'est utile à l'affichage. */
    basis?: 'HT' | 'TTC';
}
export interface NotificationHistoryStep {
    at: string;
    eventType: string;
    label?: string;
}
export interface NotificationData {
    /** Version du contrat qui a écrit l'instantané. */
    v: number;
    actor?: NotificationActor;
    /** Espace d'origine (nom affiché sur chaque ligne de la vue unifiée). */
    origin?: {
        organizationID?: string | null;
        organizationName?: string | null;
    };
    /** Référence métier affichée (numéro de facture, de devis, titre de tâche…). */
    reference?: string | null;
    /** Libellé principal et secondaire de la carte d'aperçu. */
    label?: string | null;
    sublabel?: string | null;
    /** Statut métier affiché (chaîne du domaine : `paid`, `overdue`, `to_confirm`…). */
    status?: string | null;
    amount?: NotificationAmount | null;
    dueAt?: string | null;
    startsAt?: string | null;
    endsAt?: string | null;
    location?: string | null;
    /** Document associé (nom, type, taille) pour l'aperçu. */
    document?: {
        name?: string | null;
        kind?: string | null;
        sizeBytes?: number | null;
    } | null;
    /** Instant de l'événement d'origine (ordre des mises à jour). */
    occurredAt?: string | null;
    /** Historique de l'élément, du plus récent au plus ancien, 20 étapes au plus. */
    history?: NotificationHistoryStep[];
    /** Identifiants utiles aux actions (jamais des secrets ni des jetons). */
    refs?: Record<string, string>;
    /** Clé d'événement du dernier message appliqué. */
    lastEventKey?: string | null;
}
export declare const NOTIFICATION_HISTORY_MAX = 20;
/** Ajoute une étape en tête de l'historique (bornée), sans doublon de clé d'événement. */
export declare function pushHistory(history: NotificationHistoryStep[] | undefined, step: NotificationHistoryStep): NotificationHistoryStep[];
export interface NotificationEntityDescriptor {
    category: NotificationCategory;
    /** Chemin dans l'espace d'une organisation (`null` : pas de page côté organisation). */
    organizationPath: ((organizationID: string, entityID: string) => string) | null;
    /** Chemin dans l'espace personnel (`null` : pas de page personnelle). */
    personalPath: ((entityID: string) => string) | null;
}
/** `entityType` → où l'objet se consulte. Les libellés (vocabulaire métier) vivent dans les messages i18n. */
export declare const NOTIFICATION_ENTITIES: Record<string, NotificationEntityDescriptor>;
export declare function describeNotificationEntity(entityType: string | null | undefined): NotificationEntityDescriptor | null;
/** Page d'un objet, selon l'espace courant ; `null` si aucune page ne lui correspond. */
export declare function notificationEntityPath(entityType: string | null | undefined, entityID: string | null | undefined, organizationID?: string | null): string | null;
export interface NotificationFeedItem {
    notificationID: string;
    userID?: string | null;
    organizationID?: string | null;
    eventType?: string | null;
    category: NotificationCategory;
    priority: NotificationPriority;
    actionState: NotificationActionState;
    actedAt?: string | null;
    actedByUserID?: string | null;
    snoozedUntil?: string | null;
    threadKey?: string | null;
    actorID?: string | null;
    title: string;
    message: string;
    link?: string | null;
    entityType?: string | null;
    entityID?: string | null;
    readAt?: string | null;
    createdAt: string;
    updatedAt?: string | null;
    data?: NotificationData | null;
}
export interface NotificationCounters {
    unread: number;
    todo: number;
    todoByCategory: Partial<Record<NotificationCategory, number>>;
    /** Par espace (vue unifiée seulement) : `organizationID` → compteurs ; `personal` pour le fil personnel. */
    byScope?: Record<string, {
        unread: number;
        todo: number;
    }>;
}
/** Une notification est « à traiter » tant qu'une action est attendue et qu'elle n'est pas reportée. */
export declare function isTodo(n: Pick<NotificationFeedItem, 'actionState' | 'snoozedUntil'>, now?: Date): boolean;
export declare function isSnoozed(n: Pick<NotificationFeedItem, 'snoozedUntil'>, now?: Date): boolean;
export declare function matchesTab(n: NotificationFeedItem, tab: NotificationTab, now?: Date): boolean;
