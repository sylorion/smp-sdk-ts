import { AdminAnalyticsController, INTERNAL_SECRET_HEADER } from '../../src/domains/auth/AdminAnalyticsController';
import { AdminUserController } from '../../src/domains/auth/AdminUserController';
import { adminAnalyticsQueries } from '../../src/api/graphql/admin/queries';

/** Faux APIClient : `withHeaders` renvoie un client distinct qui mémorise ses en-têtes. */
function fakeClient(headers: Record<string, string> = {}, response: any = {}) {
  const client: any = {
    headers,
    query: jest.fn(async () => response),
    withHeaders: jest.fn((h: Record<string, string>) => {
      const scoped = fakeClient({ ...headers, ...h }, response);
      client.scoped = scoped;
      return scoped;
    }),
  };
  return client;
}

describe('AdminAnalyticsController', () => {
  it('porte le secret de service sur un client dédié, sans modifier le client partagé', async () => {
    const shared = fakeClient({}, { adminPlatformAnalytics: { days: 7 } });
    const ctrl = new AdminAnalyticsController(shared).withInternalSecret('s3cr3t');
    await expect(ctrl.getPlatformAnalytics(7)).resolves.toEqual({ days: 7 });
    expect(shared.scoped.headers).toEqual({ [INTERNAL_SECRET_HEADER]: 's3cr3t' });
    expect(shared.scoped.query).toHaveBeenCalledWith(adminAnalyticsQueries.ADMIN_PLATFORM_ANALYTICS, { days: 7 });
    expect(shared.headers).toEqual({});
    expect(shared.query).not.toHaveBeenCalled();
  });

  it('transmet période et limite à adminCommerceAnalytics', async () => {
    const shared = fakeClient({}, { adminCommerceAnalytics: { days: 30 } });
    const ctrl = new AdminAnalyticsController(shared).withInternalSecret('s3cr3t');
    await expect(ctrl.getCommerceAnalytics(30, 5)).resolves.toEqual({ days: 30 });
    expect(shared.scoped.query).toHaveBeenCalledWith(adminAnalyticsQueries.ADMIN_COMMERCE_ANALYTICS, { days: 30, limit: 5 });
  });

  it('refuse un secret vide', () => {
    expect(() => new AdminAnalyticsController(fakeClient()).withInternalSecret('')).toThrow(/secret/);
  });
});

describe('AdminUserController.withInternalSecret', () => {
  it('envoie les requêtes admin* avec le secret de service', async () => {
    const shared = fakeClient({}, { adminGetUserCount: 12 });
    await expect(new AdminUserController(shared).withInternalSecret('s3cr3t').getUserCount()).resolves.toBe(12);
    expect(shared.scoped.headers['x-smp-internal-secret']).toBe('s3cr3t');
  });

  it('refuse un secret vide', () => {
    expect(() => new AdminUserController(fakeClient()).withInternalSecret('')).toThrow(/secret/);
  });
});
