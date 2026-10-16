import { OrganizationDomain, OrganizationMailingController } from '../../src/domains/organization';
import { mailingMutations, mailingQueries } from '../../src/api/graphql/organization/mailing';

const MAILING = { mailingID: 'm1', subject: 'Offre', excerpt: 'Bonjour', sentAt: 'x', actorUserID: 'u1', recipientCount: 3, status: 'queued' };

describe('OrganizationMailingController', () => {
  const client = () => ({
    query: jest.fn(async (doc: string) => (doc === mailingQueries.LIST_ORGANIZATION_MAILINGS
      ? { organizationMailings: [MAILING] }
      : { organizationMailingPreview: { recipientCount: 3, sample: [] } })),
    mutate: jest.fn(async () => ({ sendOrganizationMailing: MAILING, unsubscribeOrganizationContactFromMailing: true })),
  });

  it('est exposé sur le domaine organisation', () => {
    expect(new OrganizationDomain(client() as any).mailing).toBeInstanceOf(OrganizationMailingController);
  });

  it('aperçu sans sélection : segment null ; envoi : entrée telle quelle, sans identité d’auteur', async () => {
    const c = client();
    const m = new OrganizationMailingController(c as any);
    await m.preview('org1');
    expect(c.query).toHaveBeenCalledWith(mailingQueries.PREVIEW_ORGANIZATION_MAILING, { organizationID: 'org1', segment: null });
    const input = { organizationID: 'org1', subject: 'Offre', message: 'Bonjour', segment: { statuses: ['lead' as const] } };
    expect(await m.send(input)).toEqual(MAILING);
    expect(c.mutate).toHaveBeenCalledWith(mailingMutations.SEND_ORGANIZATION_MAILING, { input });
    expect(await m.list('org1')).toEqual([MAILING]);
    expect(await m.unsubscribeContact('org1', 'ct1')).toBe(true);
  });
});
