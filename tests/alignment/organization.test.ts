import { organizationMutations, organizationMediaMutations, userOrganizationMutations } from '../../src/api/graphql/organization/mutations';
import * as organizationQueries from '../../src/api/graphql/organization/queries';
import { Organization } from '../../src/domains/organization/OrganizationController';
import { ManageOrganization } from '../../src/domains/organization/ManageOrganisationController';
import { mockClient, rootArgs, rootField, selected, varTypes } from './helpers';

describe('organization.organization', () => {
  test('updateMedia : organizationMediaID transmis comme argument requis de updateOrganizationMedia', async () => {
    const doc = organizationMediaMutations.UPDATE_ORGANIZATION_MEDIA;
    expect(rootArgs(doc)).toEqual({ organizationMediaID: '$organizationMediaID', input: '$input' });
    expect(varTypes(doc)).toEqual({ organizationMediaID: 'ID!', input: 'UpdateOrganizationMediaInput!' });
    const client = mockClient();
    client.mutate.mockResolvedValue({ updateOrganizationMedia: { organizationMediaID: 'om1', legend: 'L' } });
    await expect(new Organization(client).updateMedia('om1', { legend: 'L', listingPosition: 2 })).resolves.toEqual({ organizationMediaID: 'om1', legend: 'L' });
    expect(client.mutate).toHaveBeenCalledWith(doc, { organizationMediaID: 'om1', input: { legend: 'L', listingPosition: 2 } });
  });

  test('delete : renvoie l’organisation supprimée, sans deletedAt (absent du type Organization)', async () => {
    expect(selected(organizationMutations.DELETE_ORGANIZATION)).not.toContain('deletedAt');
    const client = mockClient();
    client.mutate.mockResolvedValue({ deleteOrganization: { organizationID: 'o1' } });
    await expect(new Organization(client).delete('o1')).resolves.toEqual({ organizationID: 'o1' });
    expect(client.mutate).toHaveBeenCalledWith(organizationMutations.DELETE_ORGANIZATION, { organizationID: 'o1' });
  });

  test('getMediaById / listMedias (organizationMedia(s) inexistants) retirés', () => {
    const ctl = new Organization(mockClient()) as any;
    expect(ctl.getMediaById).toBeUndefined();
    expect(ctl.listMedias).toBeUndefined();
    expect((organizationQueries as any).organizationMediaQueries).toBeUndefined();
  });
});

describe('organization.manageOrganization — rattachements', () => {
  const membershipFields = ['userOrganizationID', 'userID', 'organizationID', 'roleID', 'state', 'createdAt', 'updatedAt'];

  test('les documents sélectionnent les vrais champs de UserOrganization', () => {
    for (const doc of [organizationMutations.UPDATE_USER_ROLE_IN_ORGANIZATION, organizationMutations.ADD_USER_TO_ORGANIZATION]) {
      expect(selected(doc)).toEqual(['success', 'message', 'userOrganization']);
      expect(selected(doc, ['userOrganization'])).toEqual(membershipFields);
    }
    // Les alias historiques pointent sur les mêmes documents (plus de copie divergente).
    expect(userOrganizationMutations.UPDATE_USER_ROLE_IN_ORGANIZATION).toBe(organizationMutations.UPDATE_USER_ROLE_IN_ORGANIZATION);
    expect(userOrganizationMutations.ADD_USER_TO_ORGANIZATION).toBe(organizationMutations.ADD_USER_TO_ORGANIZATION);
  });

  test('updateUserRole : input transmis (callerUserID inclus), réponse avec le rattachement', async () => {
    const client = mockClient();
    const res = { success: true, message: 'ok', userOrganization: { userOrganizationID: 'uo1', roleID: 'r2' } };
    client.mutate.mockResolvedValue({ updateUserRoleInOrganization: res });
    const input = { organizationID: 'o1', userID: 'u1', newRoleID: 'r2', callerUserID: 'u0' };
    await expect(new ManageOrganization(client).updateUserRole(input)).resolves.toEqual(res);
    expect(client.mutate).toHaveBeenCalledWith(organizationMutations.UPDATE_USER_ROLE_IN_ORGANIZATION, { input });
    expect(rootField(organizationMutations.UPDATE_USER_ROLE_IN_ORGANIZATION)).toBe('updateUserRoleInOrganization');
  });

  test('addUser : roleID (AddUserToOrganizationInput n’a pas de champ `role`)', async () => {
    const client = mockClient();
    client.mutate.mockResolvedValue({ addUserToOrganization: { success: true, message: 'ok', userOrganization: null } });
    await new ManageOrganization(client).addUser({ userID: 'u1', organizationID: 'o1', roleID: 'r1' });
    expect(client.mutate).toHaveBeenCalledWith(organizationMutations.ADD_USER_TO_ORGANIZATION, { input: { userID: 'u1', organizationID: 'o1', roleID: 'r1' } });
  });
});
