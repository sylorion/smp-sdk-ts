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

describe('OrganizationMailingController — campagnes et charte', () => {
  const CAMPAIGN = { campaignID: 'k1', name: 'Rentrée', status: 'draft' };
  it('campagnes, copie, envoi, suppression, charte : variables sans identité d’auteur', async () => {
    const c = {
      query: jest.fn(async (doc: string) => (doc === mailingQueries.LIST_ORGANIZATION_CAMPAIGNS ? { organizationCampaigns: [CAMPAIGN] }
        : doc === mailingQueries.ORGANIZATION_EMAIL_SETTINGS ? { organizationEmailSettings: { canCustomize: true } } : { organizationContactsLastMailed: [] })),
      mutate: jest.fn(async () => ({
        saveOrganizationCampaign: CAMPAIGN, duplicateOrganizationCampaign: { ...CAMPAIGN, campaignID: 'k2' }, sendOrganizationCampaign: { ...CAMPAIGN, status: 'sent' },
        deleteOrganizationCampaign: true, saveOrganizationEmailTemplate: { canCustomize: true },
      })),
    };
    const m = new OrganizationMailingController(c as any);
    expect(await m.campaigns('o1')).toEqual([CAMPAIGN]);
    await m.saveCampaign({ organizationID: 'o1', name: 'Rentrée', scheduledAt: null });
    expect(c.mutate).toHaveBeenLastCalledWith(mailingMutations.SAVE_ORGANIZATION_CAMPAIGN, { input: { organizationID: 'o1', name: 'Rentrée', scheduledAt: null } });
    expect((await m.duplicateCampaign('o1', 'k1')).campaignID).toBe('k2');
    expect((await m.sendCampaign('o1', 'k1')).status).toBe('sent');
    expect(await m.deleteCampaign('o1', 'k1')).toBe(true);
    expect((await m.emailSettings('o1')).canCustomize).toBe(true);
    await m.saveEmailTemplate('o1', { layout: 'lettre' });
    expect(c.mutate).toHaveBeenLastCalledWith(mailingMutations.SAVE_ORGANIZATION_EMAIL_TEMPLATE, { input: { organizationID: 'o1', layout: 'lettre' } });
    expect(await m.contactsLastMailed('o1')).toEqual([]);
    for (const doc of Object.values(mailingMutations)) expect(doc).not.toMatch(/createdBy:\s*\$|actorUserID:\s*\$/);
  });
});
