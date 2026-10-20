/** Champs d'une notification du fil (anciens + ajouts additifs du 20/10). */
export declare const NOTIFICATION_FEED_FIELDS = "\n  notificationID\n  userID\n  organizationID\n  title\n  message\n  readAt\n  link\n  entityType\n  entityID\n  type\n  notificationTemplateID\n  createdAt\n  updatedAt\n  eventType\n  category\n  priority\n  actionState\n  actedAt\n  actedByUserID\n  snoozedUntil\n  threadKey\n  actorID\n  data\n";
export declare const notificationFeedQueries: {
    NOTIFICATION_FEED: string;
    NOTIFICATION_COUNTERS: string;
};
export declare const notificationFeedMutations: {
    MARK_NOTIFICATION_READ: string;
    MARK_NOTIFICATION_UNREAD: string;
    SNOOZE_NOTIFICATION: string;
    RECORD_NOTIFICATION_ACTION: string;
    REOPEN_NOTIFICATION: string;
    MARK_NOTIFICATIONS_READ: string;
    MARK_ALL_NOTIFICATIONS_READ_IN_SCOPE: string;
};
