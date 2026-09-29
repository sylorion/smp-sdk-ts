import { parse, OperationDefinitionNode, FieldNode } from 'graphql';
import { referralQueries } from '../../src/api/graphql/referral/queries';
import { referralMutations } from '../../src/api/graphql/referral/mutations';
import { ReferralController } from '../../src/domains/referral/ReferralController';
import { ReferralDomain } from '../../src/domains/referral';

/** Apport d'affaires — contrat avec mu-command (docs/architecture/apport-affaires.md §4). */
const rootField = (doc: string) =>
  ((parse(doc).definitions[0] as OperationDefinitionNode).selectionSet.selections[0] as FieldNode).name.value;

describe('referral — documents GraphQL', () => {
  const expected: Record<string, string> = {
    GET_REFERRAL_OFFER: 'referralOffer',
    GET_REFERRAL_MARKETPLACE: 'referralMarketplace',
    GET_REFERRAL_PARTNERSHIPS: 'referralPartnerships',
    GET_REFERRAL_COMMISSIONS: 'referralCommissions',
    GET_REFERRAL_STATS: 'referralStats',
    RESOLVE_REFERRAL_TOKEN: 'resolveReferralToken',
    UPSERT_REFERRAL_OFFER: 'upsertReferralOffer',
    REQUEST_REFERRAL_PARTNERSHIP: 'requestReferralPartnership',
    DECIDE_REFERRAL_PARTNERSHIP: 'decideReferralPartnership',
    REVOKE_REFERRAL_PARTNERSHIP: 'revokeReferralPartnership',
    REGENERATE_REFERRAL_TOKEN: 'regenerateReferralToken',
  };
  const all: Record<string, string> = { ...referralQueries, ...referralMutations };
  test('toutes les opérations du module sont couvertes, ni plus ni moins', () => {
    expect(Object.keys(all).sort()).toEqual(Object.keys(expected).sort());
  });
  test.each(Object.entries(expected))('%s cible %s', (name, field) => expect(rootField(all[name])).toBe(field));
  test('le jeton public ne révèle rien de l’apporteur', () => {
    expect(referralQueries.RESOLVE_REFERRAL_TOKEN).not.toMatch(/apporteur|organization/i);
  });
});

describe('ReferralController', () => {
  function build() {
    const client: any = { query: jest.fn(), mutate: jest.fn() };
    return { ctl: new ReferralController(client), client };
  }

  test('exposé sur le domaine referral', () => {
    expect(new ReferralDomain({} as any).referral).toBeInstanceOf(ReferralController);
  });

  test('offre : lecture (null si jamais configurée) et enregistrement', async () => {
    const { ctl, client } = build();
    client.query.mockResolvedValueOnce({ referralOffer: null });
    await expect(ctl.getOffer('s1')).resolves.toBeNull();
    client.mutate.mockResolvedValueOnce({ upsertReferralOffer: { serviceId: 's1', enabled: true, commissionRate: 10 } });
    const data = { enabled: true, commissionRate: 10, approvalMode: 'manual' as const, attributionDays: 30 };
    await ctl.upsertOffer('s1', data);
    expect(client.mutate).toHaveBeenCalledWith(referralMutations.UPSERT_REFERRAL_OFFER, { serviceId: 's1', data });
  });

  test('catalogue et listes : seuls les filtres renseignés sont envoyés, listes vides par défaut', async () => {
    const { ctl, client } = build();
    client.query.mockResolvedValue({});
    await expect(ctl.marketplace('org-a')).resolves.toEqual([]);
    expect(client.query).toHaveBeenLastCalledWith(referralQueries.GET_REFERRAL_MARKETPLACE, { apporteurOrganizationId: 'org-a' });
    await ctl.marketplace('org-a', { search: 'audit', limit: 20, offset: 0 });
    expect(client.query).toHaveBeenLastCalledWith(referralQueries.GET_REFERRAL_MARKETPLACE, { apporteurOrganizationId: 'org-a', search: 'audit', limit: 20, offset: 0 });
    await expect(ctl.partnerships('org-a', 'apporteur')).resolves.toEqual([]);
    expect(client.query).toHaveBeenLastCalledWith(referralQueries.GET_REFERRAL_PARTNERSHIPS, { organizationId: 'org-a', role: 'apporteur' });
    await ctl.commissions('org-p', 'provider', { status: ['payout_failed'] });
    expect(client.query).toHaveBeenLastCalledWith(referralQueries.GET_REFERRAL_COMMISSIONS, { organizationId: 'org-p', role: 'provider', status: ['payout_failed'] });
  });

  test('jeton invalide ou réponse vide : valid=false', async () => {
    const { ctl, client } = build();
    client.query.mockResolvedValueOnce({});
    await expect(ctl.resolveToken('ref_x')).resolves.toEqual({ valid: false });
  });

  test('partenariat : demande avec mandat, décision, fin, nouveau lien', async () => {
    const { ctl, client } = build();
    client.mutate.mockResolvedValue({ requestReferralPartnership: { status: 'pending' } });
    const data = { serviceId: 's1', apporteurOrganizationId: 'org-a', acceptMandate: true };
    await expect(ctl.requestPartnership(data)).resolves.toEqual({ status: 'pending' });
    expect(client.mutate).toHaveBeenLastCalledWith(referralMutations.REQUEST_REFERRAL_PARTNERSHIP, { data });

    client.mutate.mockResolvedValue({ decideReferralPartnership: { status: 'approved' } });
    await ctl.decidePartnership('p1', 'approve');
    expect(client.mutate).toHaveBeenLastCalledWith(referralMutations.DECIDE_REFERRAL_PARTNERSHIP, { partnershipId: 'p1', decision: 'approve' });
    await ctl.decidePartnership('p1', 'reject', 'Hors zone');
    expect(client.mutate).toHaveBeenLastCalledWith(referralMutations.DECIDE_REFERRAL_PARTNERSHIP, { partnershipId: 'p1', decision: 'reject', reason: 'Hors zone' });

    client.mutate.mockResolvedValue({ revokeReferralPartnership: { status: 'revoked' } });
    await ctl.revokePartnership('p1');
    expect(client.mutate).toHaveBeenLastCalledWith(referralMutations.REVOKE_REFERRAL_PARTNERSHIP, { partnershipId: 'p1' });

    client.mutate.mockResolvedValue({ regenerateReferralToken: { token: 'ref_new' } });
    await expect(ctl.regenerateToken('p1')).resolves.toEqual({ token: 'ref_new' });
  });

  test('les erreurs du serveur remontent telles quelles (REFERRAL_MANDATE_REQUIRED)', async () => {
    const { ctl, client } = build();
    const err = Object.assign(new Error('Mandat requis'), { extensions: { code: 'REFERRAL_MANDATE_REQUIRED' } });
    client.mutate.mockRejectedValue(err);
    await expect(ctl.requestPartnership({ serviceId: 's1', apporteurOrganizationId: 'org-a', acceptMandate: false })).rejects.toBe(err);
  });
});
