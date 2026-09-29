import { mailingQueries, notificationQueries } from '../../src/api/graphql/communication/queries';
import { waitingListQueries } from '../../src/api/graphql/user/queries';
import { waitingListMutations } from '../../src/api/graphql/user/mutations';
import { Notification } from '../../src/domains/communication/NotificationController';
import { Mailing } from '../../src/domains/communication/MailingController';
import { WaitingList } from '../../src/domains/communication/WaitingListController';
import { mockClient, rootArgs, rootField, selected, varTypes } from './helpers';

describe('communication.notification', () => {
  test('getById vise notification(notificationID:) — notificationByID n’existe pas', async () => {
    expect(rootField(notificationQueries.GET_NOTIFICATION_BY_ID)).toBe('notification');
    expect(rootArgs(notificationQueries.GET_NOTIFICATION_BY_ID)).toEqual({ notificationID: '$notificationID' });
    const client = mockClient();
    client.query.mockResolvedValue({ notification: { notificationID: 'n1', userID: 'u1', readAt: null } });
    await expect(new Notification(client).getById('n1')).resolves.toEqual({ notificationID: 'n1', userID: 'u1', readAt: null });
    expect(client.query).toHaveBeenCalledWith(notificationQueries.GET_NOTIFICATION_BY_ID, { notificationID: 'n1' });
    // Le contrôle d'appartenance du webapp lit userID / organizationID : ils doivent être sélectionnés.
    expect(selected(notificationQueries.GET_NOTIFICATION_BY_ID)).toEqual(expect.arrayContaining(['userID', 'organizationID', 'readAt']));
  });

  test('getById : notification absente → null', async () => {
    const client = mockClient();
    client.query.mockResolvedValue({ notification: null });
    await expect(new Notification(client).getById('x')).resolves.toBeNull();
  });

  test('getBySlug : argument `Slug` du service ; list() (non paginable, non scopée) retiré', async () => {
    expect(rootArgs(notificationQueries.GET_NOTIFICATION_BY_SLUG)).toEqual({ Slug: '$slug' });
    const client = mockClient();
    client.query.mockResolvedValue({ notificationBySlug: { notificationID: 'n2' } });
    await expect(new Notification(client).getBySlug('s')).resolves.toEqual({ notificationID: 'n2' });
    expect(client.query).toHaveBeenCalledWith(notificationQueries.GET_NOTIFICATION_BY_SLUG, { slug: 's' });
    expect((new Notification(client) as any).list).toBeUndefined();
    expect((notificationQueries as any).GET_NOTIFICATIONS).toBeUndefined();
  });
});

describe('communication.mailing', () => {
  test('campagne / newsletter : plus de uniqRef, slug, groupIDs, deletedAt (absents de mu-notification)', async () => {
    for (const doc of [mailingQueries.GET_CAMPAIGN_BY_ID, mailingQueries.GET_NEWSLETTER]) {
      for (const f of ['uniqRef', 'slug', 'groupIDs', 'deletedAt']) expect(selected(doc)).not.toContain(f);
    }
    const client = mockClient();
    const m = new Mailing(client);
    client.query.mockResolvedValueOnce({ campaign: { campaignID: 'c1', subject: 'S' } });
    await expect(m.getCampaignById('c1')).resolves.toEqual({ campaignID: 'c1', subject: 'S' });
    expect(client.query).toHaveBeenLastCalledWith(mailingQueries.GET_CAMPAIGN_BY_ID, { campaignID: 'c1' });
    client.query.mockResolvedValueOnce({ newsletter: { newsletterID: 'nl1' } });
    await expect(m.getNewsletterById('nl1')).resolves.toEqual({ newsletterID: 'nl1' });
    expect(client.query).toHaveBeenLastCalledWith(mailingQueries.GET_NEWSLETTER, { newsletterID: 'nl1' });
  });
});

describe('communication.waitingList (mu-authentication)', () => {
  const entity = { waitingListID: 'w1', lastName: 'Doe', email: 'd@x.io', city: 'Paris', details: '{}', age: 30 };

  test('types d’entrée réels : CreateWaitingListInput / UpdateWaitingListInput, state: ObjectStatus', () => {
    expect(varTypes(waitingListMutations.CREATE_WAITING_LIST)).toEqual({ input: 'CreateWaitingListInput!' });
    expect(varTypes(waitingListMutations.UPDATE_WAITING_LIST)).toEqual({ waitingListID: 'ID!', input: 'UpdateWaitingListInput!' });
    expect(varTypes(waitingListQueries.GET_WAITING_LISTS)).toEqual({ page: 'Int', limit: 'Int', state: 'ObjectStatus' });
  });

  test('create : input transmis tel quel, entité extraite de WaitingListResponse', async () => {
    const client = mockClient();
    client.mutate.mockResolvedValue({ createWaitingList: { success: true, message: 'ok', waitingList: entity } });
    const input = { lastName: 'Doe', email: 'd@x.io', city: 'Paris', details: '{}', age: 30 };
    await expect(new WaitingList(client).create(input)).resolves.toEqual(entity);
    expect(client.mutate).toHaveBeenCalledWith(waitingListMutations.CREATE_WAITING_LIST, { input });
  });

  test('create : refus métier (success false, waitingList null) → erreur explicite, pas un succès vide', async () => {
    const client = mockClient();
    client.mutate.mockResolvedValue({ createWaitingList: { success: false, message: 'Email déjà inscrit', waitingList: null } });
    await expect(new WaitingList(client).create({ lastName: 'D', email: 'd@x.io', city: 'P', details: '', age: 1 })).rejects.toThrow('Email déjà inscrit');
  });

  test('update : mise à jour partielle', async () => {
    const client = mockClient();
    client.mutate.mockResolvedValue({ updateWaitingList: { success: true, message: 'ok', waitingList: { ...entity, city: 'Lyon' } } });
    await expect(new WaitingList(client).update('w1', { city: 'Lyon' })).resolves.toMatchObject({ city: 'Lyon' });
    expect(client.mutate).toHaveBeenCalledWith(waitingListMutations.UPDATE_WAITING_LIST, { waitingListID: 'w1', input: { city: 'Lyon' } });
  });

  test('list : page / limit / state transmis, réponse nulle → []', async () => {
    const client = mockClient();
    client.query.mockResolvedValueOnce({ waitingLists: [entity] });
    await expect(new WaitingList(client).list({ page: 2, limit: 10, state: 'online' })).resolves.toEqual([entity]);
    expect(client.query).toHaveBeenLastCalledWith(waitingListQueries.GET_WAITING_LISTS, { page: 2, limit: 10, state: 'online' });
    client.query.mockResolvedValueOnce({ waitingLists: null });
    await expect(new WaitingList(client).list()).resolves.toEqual([]);
  });
});
