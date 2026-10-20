import { CommunicationDomain } from '../../src/domains/communication';
import { Notification } from '../../src/domains/communication/NotificationController';
import { notificationFeedMutations, notificationFeedQueries } from '../../src/api/graphql/communication/notificationFeed';
import { describeNotificationType, matchesTab } from '../../src/domains/communication/notifications/notifications.generated';

const ITEM = { notificationID: 'n1', title: 't', message: 'm', category: 'invoices', priority: 'high', actionState: 'pending', createdAt: '2026-10-20T10:00:00.000Z' };

describe('Notification — centre de notifications (20/10)', () => {
  const client = () => ({
    query: jest.fn(async (doc: string) => (doc === notificationFeedQueries.NOTIFICATION_FEED
      ? { notificationFeed: { items: [ITEM], nextCursor: 'c2' } }
      : { notificationCounters: { unread: 2, todo: 1, todoByCategory: { invoices: 1 }, byScope: null } })),
    mutate: jest.fn(async () => ({ markNotificationRead: ITEM, markNotificationUnread: ITEM, snoozeNotification: ITEM, recordNotificationAction: { ...ITEM, actionState: 'done' }, reopenNotification: ITEM, markAllNotificationsReadInScope: 4 })),
  });

  it('est exposé sur le domaine communication', () => {
    expect(new CommunicationDomain(client() as any).notification).toBeInstanceOf(Notification);
  });

  it('fil et compteurs : aucun identifiant d’utilisateur dans les variables (périmètre = identité du client)', async () => {
    const c = client();
    const n = new Notification(c as any);
    expect(await n.feed({ organizationID: 'org1', tab: 'todo', limit: 20 })).toEqual({ items: [ITEM], nextCursor: 'c2' });
    expect(c.query).toHaveBeenCalledWith(notificationFeedQueries.NOTIFICATION_FEED, { input: { organizationID: 'org1', tab: 'todo', limit: 20 } });
    await n.feed();
    expect(c.query).toHaveBeenLastCalledWith(notificationFeedQueries.NOTIFICATION_FEED, { input: { organizationID: null } });
    expect(await n.counters()).toMatchObject({ unread: 2, todo: 1 });
    expect(JSON.stringify(c.query.mock.calls.map((call: any[]) => call[1]))).not.toMatch(/userID/);
  });

  it('mutations : lu, non lu, report, traitement, réouverture, tout lire', async () => {
    const c = client();
    const n = new Notification(c as any);
    await n.markRead('n1');
    expect(c.mutate).toHaveBeenCalledWith(notificationFeedMutations.MARK_NOTIFICATION_READ, { notificationID: 'n1' });
    await n.markUnread('n1');
    await n.snooze('n1', '2026-10-21T08:00:00.000Z');
    expect(c.mutate).toHaveBeenCalledWith(notificationFeedMutations.SNOOZE_NOTIFICATION, { notificationID: 'n1', until: '2026-10-21T08:00:00.000Z' });
    expect((await n.recordAction({ notificationID: 'n1', actionKey: 'pay_invoice' })).actionState).toBe('done');
    await n.reopen('n1');
    expect(await n.markAllReadInScope('org1')).toBe(4);
    expect(c.mutate).toHaveBeenLastCalledWith(notificationFeedMutations.MARK_ALL_NOTIFICATIONS_READ_IN_SCOPE, { organizationID: 'org1' });
  });

  it('le contrat partagé est embarqué (descripteurs et onglets utilisables côté client)', () => {
    expect(describeNotificationType('invoice.payment.invitation.sent').requiresAction).toBe(true);
    expect(matchesTab(ITEM as any, 'todo')).toBe(true);
  });
});
