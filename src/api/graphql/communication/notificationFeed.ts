// Centre de notifications (mu-notification, 20/10) — fil paginé, compteurs et actions,
// toujours dans le périmètre de l'identité signée portée par le client (jamais d'identifiant
// d'utilisateur dans les variables). Contrat partagé : ../../../domains/communication/notifications.

/** Champs d'une notification du fil (anciens + ajouts additifs du 20/10). */
export const NOTIFICATION_FEED_FIELDS = `
  notificationID
  userID
  organizationID
  title
  message
  readAt
  link
  entityType
  entityID
  type
  notificationTemplateID
  createdAt
  updatedAt
  eventType
  category
  priority
  actionState
  actedAt
  actedByUserID
  snoozedUntil
  threadKey
  actorID
  data
`;

export const notificationFeedQueries = {
  NOTIFICATION_FEED: `
    query NotificationFeed($input: NotificationFeedInput) {
      notificationFeed(input: $input) {
        items { ${NOTIFICATION_FEED_FIELDS} }
        nextCursor
      }
    }
  `,
  NOTIFICATION_COUNTERS: `
    query NotificationCounters($organizationID: ID) {
      notificationCounters(organizationID: $organizationID) {
        unread
        todo
        todoByCategory
        byScope
      }
    }
  `,
};

export const notificationFeedMutations = {
  MARK_NOTIFICATION_READ: `
    mutation MarkNotificationRead($notificationID: ID!) {
      markNotificationRead(notificationID: $notificationID) { ${NOTIFICATION_FEED_FIELDS} }
    }
  `,
  MARK_NOTIFICATION_UNREAD: `
    mutation MarkNotificationUnread($notificationID: ID!) {
      markNotificationUnread(notificationID: $notificationID) { ${NOTIFICATION_FEED_FIELDS} }
    }
  `,
  SNOOZE_NOTIFICATION: `
    mutation SnoozeNotification($notificationID: ID!, $until: DateTime) {
      snoozeNotification(notificationID: $notificationID, until: $until) { ${NOTIFICATION_FEED_FIELDS} }
    }
  `,
  RECORD_NOTIFICATION_ACTION: `
    mutation RecordNotificationAction($input: RecordNotificationActionInput!) {
      recordNotificationAction(input: $input) { ${NOTIFICATION_FEED_FIELDS} }
    }
  `,
  REOPEN_NOTIFICATION: `
    mutation ReopenNotification($notificationID: ID!) {
      reopenNotification(notificationID: $notificationID) { ${NOTIFICATION_FEED_FIELDS} }
    }
  `,
  MARK_NOTIFICATIONS_READ: `
    mutation MarkNotificationsRead($notificationIDs: [ID!]!) {
      markNotificationsRead(notificationIDs: $notificationIDs)
    }
  `,
  MARK_ALL_NOTIFICATIONS_READ_IN_SCOPE: `
    mutation MarkAllNotificationsReadInScope($organizationID: ID) {
      markAllNotificationsReadInScope(organizationID: $organizationID)
    }
  `,
};
