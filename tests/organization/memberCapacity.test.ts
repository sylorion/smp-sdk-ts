import { ManageOrganization } from '../../src/domains/organization/ManageOrganisationController';
import { organizationMutations } from '../../src/api/graphql/organization/mutations';
import { organizationQueries } from '../../src/api/graphql/organization/queries';

describe('Capacité hebdomadaire des membres', () => {
  const client = (response: unknown) => ({ query: jest.fn(async () => response), mutate: jest.fn(async () => response) });

  it('getMemberCapacities lit memberCapacities avec l’organisation seule', async () => {
    const c = client({ memberCapacities: [{ userID: 'u1', weeklyCapacityHours: 28 }, { userID: 'u2', weeklyCapacityHours: 35 }] });
    const r = await new ManageOrganization(c as any).getMemberCapacities('org1');
    expect(c.query).toHaveBeenCalledWith(organizationQueries.GET_MEMBER_CAPACITIES, { organizationID: 'org1' });
    expect(r).toEqual([{ userID: 'u1', weeklyCapacityHours: 28 }, { userID: 'u2', weeklyCapacityHours: 35 }]);
  });

  it('réponse vide : liste vide, jamais undefined', async () => {
    const r = await new ManageOrganization(client({}) as any).getMemberCapacities('org1');
    expect(r).toEqual([]);
  });

  it('la capacité voyage avec le profil, la liste des membres et la mise à jour', () => {
    expect(organizationQueries.GET_MEMBER_PROFILE).toContain('weeklyCapacityHours');
    expect(organizationQueries.GET_ORGANIZATION_MEMBERS).toContain('weeklyCapacityHours');
    expect(organizationMutations.UPDATE_MEMBER_PROFILE).toContain('weeklyCapacityHours');
  });

  it('updateMemberProfile transmet la capacité telle quelle', async () => {
    const c = client({ updateMemberProfile: { success: true, weeklyCapacityHours: 24 } });
    const input = { organizationID: 'org1', targetUserID: 'u1', callerUserID: 'ignored', weeklyCapacityHours: 24 };
    const r = await new ManageOrganization(c as any).updateMemberProfile(input);
    expect(c.mutate).toHaveBeenCalledWith(organizationMutations.UPDATE_MEMBER_PROFILE, { input });
    expect(r.weeklyCapacityHours).toBe(24);
  });
});
