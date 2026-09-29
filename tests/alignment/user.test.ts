import { profileQueries } from '../../src/api/graphql/user/queries';
import { Profile } from '../../src/domains/user/ProfileController';
import { mockClient, rootField, selected } from './helpers';

describe('user.profile.getByUserId', () => {
  test('ne sélectionne plus `bio` (absent du type Profile) — la requête entière était rejetée', () => {
    const doc = profileQueries.GET_PROFILES_BY_USER_ID;
    expect(rootField(doc)).toBe('profilesByUserID');
    expect(selected(doc)).not.toContain('bio');
    expect(selected(doc)).toEqual(expect.arrayContaining(['profileID', 'userID', 'firstName', 'lastName', 'profilePicture']));
  });

  test('renvoie les profils, [] si la réponse est vide', async () => {
    const client = mockClient();
    client.query.mockResolvedValueOnce({ profilesByUserID: [{ profileID: 'p1', userID: 'u1' }] });
    await expect(new Profile(client).getByUserId('u1')).resolves.toEqual([{ profileID: 'p1', userID: 'u1' }]);
    expect(client.query).toHaveBeenCalledWith(profileQueries.GET_PROFILES_BY_USER_ID, { userID: 'u1' });
    client.query.mockResolvedValueOnce({ profilesByUserID: null });
    await expect(new Profile(client).getByUserId('u2')).resolves.toEqual([]);
  });
});
