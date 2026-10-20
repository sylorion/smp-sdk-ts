import { ManageOrganization } from '../../src/domains/organization/ManageOrganisationController';
import { businessHoursMutations, businessHoursQueries } from '../../src/api/graphql/organization/businessHours';

describe("Horaires d'ouverture de l'organisation", () => {
  const client = (response: unknown) => ({ query: jest.fn(async () => response), mutate: jest.fn(async () => response) });
  const hours = { organizationID: 'org1', configured: true, alwaysOpen: false, timezone: 'Europe/Paris', ranges: [{ isoDay: 1, start: '22:00', end: '06:00' }], updatedAt: null };

  it('getBusinessHours lit organizationBusinessHours avec l’organisation seule', async () => {
    const c = client({ organizationBusinessHours: hours });
    await expect(new ManageOrganization(c as any).getBusinessHours('org1')).resolves.toEqual(hours);
    expect(c.query).toHaveBeenCalledWith(businessHoursQueries.GET_ORGANIZATION_BUSINESS_HOURS, { organizationID: 'org1' });
  });

  it('updateBusinessHours transmet l’entrée telle quelle', async () => {
    const c = client({ updateOrganizationBusinessHours: hours });
    const input = { organizationID: 'org1', alwaysOpen: false, timezone: 'Europe/Paris', ranges: hours.ranges };
    await expect(new ManageOrganization(c as any).updateBusinessHours(input)).resolves.toEqual(hours);
    expect(c.mutate).toHaveBeenCalledWith(businessHoursMutations.UPDATE_ORGANIZATION_BUSINESS_HOURS, { input });
  });
});
